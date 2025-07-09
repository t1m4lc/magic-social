// server/api/stripe/create-checkout-session.ts

import { useServerStripe } from "#stripe/server";
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { z } from "zod";
import { Database } from "~/supabase/supabase";
import { defineEventHandler, readBody, createError, getQuery } from "h3";

const checkoutSessionSchema = z.object({
  priceId: z.string().startsWith("price_"), // Stripe Price ID
});

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user || !user.id || !user.email) {
    // This implies user is NOT logged in or session is invalid.
    // If you see this error, the frontend needs to ensure user is authenticated.
    console.error(
      "[Checkout Session API] Unauthorized: User or user ID/email missing."
    );
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // --- CRITICAL DEBUGGING LINE ---
  // Log the exact user.id that will be passed to Stripe metadata.
  console.log(
    `[Checkout Session API Debug] Supabase User ID retrieved: ${user.id}`
  );
  console.log(
    `[Checkout Session API Debug] Supabase User Email retrieved: ${user.email}`
  );
  // --- END CRITICAL DEBUGGING LINE ---

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
  console.log(
    `[Checkout Session API] User ${user.id} processing for price ID: ${priceId}`
  );

  const stripe = await useServerStripe(event);
  const supabaseAdminClient = serverSupabaseServiceRole<Database>(event);

  const host = event.node.req.headers.host;
  if (!host) {
    console.error(
      "[Checkout Session API] Could not determine host from request headers."
    );
    throw createError({
      statusCode: 500,
      message: "Server configuration error: Host header missing.",
    });
  }

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  console.log(`[Checkout Session API] Dynamic Base URL determined: ${baseUrl}`);

  // --- BEGIN SERVER-SIDE SUBSCRIPTION CHECK ---
  const { data: existingSubscriptions, error: existingSubError } =
    await supabaseAdminClient
      .from("subscriptions")
      .select(
        "stripe_subscription_id, status, stripe_price_id, stripe_customer_id"
      )
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"]);

  if (existingSubError) {
    console.error(
      `[Checkout Session API] Error checking existing subscriptions for user ${user.id}:`,
      existingSubError
    );
    throw createError({
      statusCode: 500,
      message: "Error checking existing subscriptions.",
    });
  }

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    const activeSub = existingSubscriptions[0];
    console.log(
      `[Checkout Session API] User ${user.id} already has an active/trialing subscription: ${activeSub.stripe_subscription_id} (Status: ${activeSub.status}).`
    );
    throw createError({
      statusCode: 409,
      message:
        "User already has an active subscription. Please manage your subscription in the customer portal.",
      data: {
        isSubscribed: true,
      },
    });
  }
  // --- END SERVER-SIDE SUBSCRIPTION CHECK ---

  let stripeCustomerId: string | undefined | null;

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
      `[Checkout Session API] No Stripe customer ID found for user ${user.id} in subscriptions. Creating a new Stripe customer.`
    );
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        metadata: {
          supabase_user_id: user.id, // Good to keep this consistent on the customer object too
        },
      });
      stripeCustomerId = customer.id;
      console.log(
        `[Checkout Session API] Created Stripe customer ${stripeCustomerId} for user ${user.id}.`
      );
    } catch (e: any) {
      console.error(
        `[Checkout Session API] Error in Stripe customer creation for user ${user.id}:`,
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

  const query = getQuery(event);
  const redirectParam = query.redirect as string;

  let successUrl = `${baseUrl}/dashboard?success=true`;

  if (redirectParam && typeof redirectParam === "string") {
    if (redirectParam.startsWith("/") && !redirectParam.includes("://")) {
      successUrl = `${baseUrl}${redirectParam}`;
    } else {
      console.warn(
        `[Checkout Session API] Invalid redirect URL ignored: ${redirectParam}`
      );
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId!,
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
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      // Set metadata on the subscription that will be created
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          stripe_price_id: priceId,
        },
      },
      // Keep session metadata for tracking the checkout process
      metadata: {
        supabase_user_id: user.id, // Pass the Supabase user ID for traceability
        stripe_price_id: priceId,
      },
    });

    console.log(
      `[Checkout Session API] Created Stripe Checkout Session ${session.id} for user ${user.id}. Session URL: ${session.url}`
    );

    return { sessionId: session.id, sessionUrl: session.url };
  } catch (error: any) {
    console.error(
      "[Checkout Session API] Stripe Checkout Session Error:",
      error
    );
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create checkout session",
      data: { rawError: error.message },
    });
  }
});
