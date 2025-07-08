import { useServerStripe } from "#stripe/server"; // Provided by @unlok-co/nuxt-stripe
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { z } from "zod";
import { Database } from "~/supabase/supabase";

const checkoutSessionSchema = z.object({
  priceId: z.string().startsWith("price_"), // Stripe Price ID
});

// Utility to ensure baseUrl always has a valid scheme
const getBaseUrl = (): string => {
  // Fallbacks
  if (process.env.NODE_ENV === "production") {
    return "https://magic-social.com"; // <-- Set your production domain here
  }
  return "http://localhost:3000";
};

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user || !user.id || !user.email) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const validation = checkoutSessionSchema.safeParse(body);

  if (!validation.success) {
    console.error(
      "[Checkout Session API] Validation failed:",
      validation.error.issues
    );
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
      data: validation.error.issues,
    });
  }

  const { priceId } = validation.data;
  console.log("[Checkout Session API] Processing for price ID:", priceId);

  const stripe = await useServerStripe(event);
  const supabaseAdminClient = serverSupabaseServiceRole<Database>(event);
  const baseUrl = getBaseUrl();

  // --- BEGIN SERVER-SIDE SUBSCRIPTION CHECK ---
  const { data: existingSubscriptions, error: existingSubError } =
    await supabaseAdminClient
      .from("subscriptions")
      .select("stripe_subscription_id, status, stripe_price_id")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"]); // Check for active or trialing subscriptions

  if (existingSubError) {
    console.error(
      `Error checking existing subscriptions for user ${user.id}:`,
      existingSubError
    );
    throw createError({
      statusCode: 500,
      message: "Error checking existing subscriptions.",
    });
  }

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    // User has at least one active or trialing subscription.
    // We should prevent creating a new one and guide them to the portal.
    // For simplicity, we take the first one found. Ideally, your webhook logic ensures only one is truly active.
    const activeSub = existingSubscriptions[0];
    console.log(
      `User ${user.id} already has an active/trialing subscription: ${activeSub.stripe_subscription_id} (Status: ${activeSub.status}).`
    );

    // Option 1: Return a specific error/status to the client to handle redirection to portal
    // The client-side pricing page can then use redirectToCustomerPortal()
    throw createError({
      statusCode: 409, // Conflict
      message:
        "User already has an active subscription. Please manage your subscription in the customer portal.",
      data: {
        isSubscribed: true,
        // Optionally, you could try to generate and return the portal URL here,
        // but it adds complexity. Simpler to let client call the dedicated portal endpoint.
      },
    });

    // Option 2: Directly create and return a portal session URL (more complex here)
    // This would require fetching the stripe_customer_id again if not already available
    // and then calling stripe.billingPortal.sessions.create(...)
    // For now, Option 1 is cleaner as the client already has portal redirection logic.
  }
  // --- END SERVER-SIDE SUBSCRIPTION CHECK ---

  let stripeCustomerId: string | undefined | null;

  // Log the user ID being processed
  console.log(`Processing checkout for Supabase user ID: ${user.id}`);

  const { data: profileData, error: profileError } = await supabaseAdminClient
    .from("profiles")
    .select("stripe_customer_id, full_name") // Also select full_name if used for Stripe customer
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error(`Error fetching profile for user ${user.id}:`, profileError);
    throw createError({
      statusCode: 500,
      message: "Error fetching user profile.",
      data: { supabaseError: profileError },
    });
  }

  if (!profileData && profileError?.code === "PGRST116") {
    console.warn(
      `Profile not found for user ${user.id}. This might indicate an issue with the handle_new_user trigger.`
    );
    // Depending on your system's design, you might want to throw an error here
    // or attempt to create a profile. For now, we proceed, assuming the update
    // might fail if the row truly doesn't exist, which will be caught below.
  }

  stripeCustomerId = profileData?.stripe_customer_id;

  if (!stripeCustomerId) {
    console.log(
      `No Stripe customer ID found for user ${user.id}. Creating a new Stripe customer.`
    );
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name:
          profileData?.full_name ||
          user.user_metadata?.full_name ||
          user.email.split("@")[0],
        metadata: {
          supabase_user_id: user.id,
        },
      });
      stripeCustomerId = customer.id;
      console.log(
        `Created Stripe customer ${stripeCustomerId} for user ${user.id}.`
      );

      console.log(
        `Attempting to update profile for user ${user.id} with Stripe customer ID ${stripeCustomerId}.`
      );
      const { error: updateProfileError } = await supabaseAdminClient
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (updateProfileError) {
        console.error(
          `Critical: Error updating profile for user ${user.id} with Stripe Customer ID ${stripeCustomerId}:`,
          JSON.stringify(updateProfileError, null, 2) // Log the full error object
        );
        throw createError({
          statusCode: 500,
          message: "Failed to save Stripe customer ID.",
          data: { supabaseErrorDetails: updateProfileError }, // Send details to client
        });
      }
      console.log(
        `Successfully updated profile for user ${user.id} with Stripe customer ID.`
      );
    } catch (e: any) {
      // Catch errors from Stripe customer creation or the re-thrown updateProfileError
      console.error(
        `Error in Stripe customer creation or profile update block for user ${user.id}:`,
        e
      );
      const errorMessage =
        e.data?.supabaseErrorDetails?.message ||
        e.message ||
        "Failed to initialize customer for Stripe.";
      throw createError({
        statusCode: 500,
        message: errorMessage,
        data: e.data || { rawError: e.message },
      });
    }
  }

  // Get query parameters to check for redirect
  const query = getQuery(event);
  const redirectParam = query.redirect as string;

  // Validate and construct success URL
  let successUrl = `${baseUrl}/dashboard?success=true`; // Default to dashboard

  if (redirectParam && typeof redirectParam === "string") {
    // Security: Only allow relative URLs that start with / and don't contain protocol
    if (redirectParam.startsWith("/") && !redirectParam.includes("://")) {
      successUrl = `${baseUrl}${redirectParam}`;
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: `${baseUrl}/pricing?canceled=true`, // Or a specific cancellation feedback page
      metadata: {
        supabase_user_id: user.id,
        stripe_price_id: priceId,
      },
    });

    return { sessionId: session.id, sessionUrl: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create checkout session",
    });
  }
});
