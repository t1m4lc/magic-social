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
      .select(
        "stripe_subscription_id, status, stripe_price_id, stripe_customer_id"
      )
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
    const activeSub = existingSubscriptions[0];
    console.log(
      `User ${user.id} already has an active/trialing subscription: ${activeSub.stripe_subscription_id} (Status: ${activeSub.status}).`
    );
    throw createError({
      statusCode: 409, // Conflict
      message:
        "User already has an active subscription. Please manage your subscription in the customer portal.",
      data: {
        isSubscribed: true,
      },
    });
  }
  // --- END SERVER-SIDE SUBSCRIPTION CHECK ---

  let stripeCustomerId: string | undefined | null;

  // Always get the most recent stripe_customer_id from subscriptions only
  const { data: lastSub } = await supabaseAdminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  stripeCustomerId = lastSub?.stripe_customer_id;

  if (!stripeCustomerId) {
    console.log(
      `No Stripe customer ID found for user ${user.id} in subscriptions. Creating a new Stripe customer.`
    );
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        metadata: {
          supabase_user_id: user.id,
        },
      });
      stripeCustomerId = customer.id;
      console.log(
        `Created Stripe customer ${stripeCustomerId} for user ${user.id}.`
      );
      // Do NOT update profiles table. Webhook will persist customer ID in subscriptions.
    } catch (e: any) {
      console.error(
        `Error in Stripe customer creation for user ${user.id}:`,
        e
      );
      const errorMessage =
        e.message || "Failed to initialize customer for Stripe.";
      throw createError({
        statusCode: 500,
        message: errorMessage,
        data: { rawError: e.message },
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
