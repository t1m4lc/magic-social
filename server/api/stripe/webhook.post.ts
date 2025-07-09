// server/api/stripe/webhook.ts

import { defineEventHandler, readRawBody, send } from "h3";
import { useServerStripe } from "#stripe/server"; // Provided by @unlok-co/nuxt-stripe
import type Stripe from "stripe";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database, TablesInsert } from "~/supabase/supabase"; // Assuming this path is correct

/**
 * Transform Stripe.Subscription into DB-ready subscription row.
 * Uses bracket notation for current_period_start and current_period_end due to Stripe type limitations.
 * Ensures that 'supabase_user_id' from Stripe metadata is mapped to 'user_id' in your DB model.
 */
const toSubscriptionModel = (
  subscription: Stripe.Subscription
): TablesInsert<"subscriptions"> => {
  const current_period_start = (subscription as any)["current_period_start"] as
    | number
    | undefined;
  const current_period_end = (subscription as any)["current_period_end"] as
    | number
    | undefined;

  // IMPORTANT: Match the key used in your checkout session creation (supabase_user_id)
  const supabaseUserId = subscription.metadata.supabase_user_id;
  if (!supabaseUserId) {
    console.warn(
      `[webhook] Missing 'supabase_user_id' in metadata for subscription ${subscription.id}`
    );
    // You might want to throw an error or handle this more robustly if it's critical.
  }

  return {
    user_id: supabaseUserId, // Map the Stripe metadata key to your DB column name
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string, // Ensure this is always a string
    stripe_price_id: subscription.items.data[0]?.price.id,
    status: subscription.status,
    metadata: subscription.metadata, // Store all metadata for debugging/future use
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    current_period_start: current_period_start
      ? new Date(current_period_start * 1000).toISOString()
      : null,
    current_period_end: current_period_end
      ? new Date(current_period_end * 1000).toISOString()
      : null,
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  };
};

const getSubscriptionFromEvent = async (
  stripe: Stripe,
  event: Stripe.Event
): Promise<Stripe.Subscription | null> => {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return event.data.object as Stripe.Subscription;
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string; // Stripe invoice object might have this
      };
      if (!invoice.subscription || typeof invoice.subscription !== "string") {
        console.warn(
          `[webhook] Invoice ${invoice.id} has no valid subscription ID.`
        );
        return null;
      }
      return await stripe.subscriptions.retrieve(invoice.subscription);
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) {
        console.warn(
          `[webhook] Checkout session ${session.id} is not a subscription or has no subscription ID.`
        );
        return null;
      }
      // When checkout.session.completed, the subscription object created by Stripe
      // will inherit metadata from the checkout session.
      // So, we retrieve the subscription, and its metadata will contain supabase_user_id.
      return await stripe.subscriptions.retrieve(
        session.subscription as string
      );
    }
    // Add other event types you care about, e.g., 'customer.created', 'customer.updated' etc.
    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
      return null;
  }
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // Access runtime config, including secrets
  const stripe = await useServerStripe(event);
  const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

  const signature = event.node.req.headers["stripe-signature"] as string;
  const rawBody = await readRawBody(event); // Raw body is required for signature verification

  if (!rawBody) {
    console.error("[webhook] Raw body is missing for webhook event.");
    return send(event, 400, "Webhook Error: Missing raw body.");
  }
  if (!signature) {
    console.error("[webhook] Stripe-Signature header is missing.");
    return send(event, 400, "Webhook Error: Missing Stripe-Signature header.");
  }
  if (!config.stripeWebhookSecret) {
    console.error("[webhook] Stripe webhook secret is not configured.");
    return send(event, 500, "Server Error: Stripe webhook secret not set.");
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      rawBody, // Ensure rawBody is passed
      signature,
      config.stripeWebhookSecret // Your webhook secret from Stripe Dashboard
    );
    console.log(
      `[webhook] Successfully verified Stripe event: ${stripeEvent.type}`
    );
  } catch (error: any) {
    console.error(`[webhook] Error verifying signature: ${error.message}`);
    // Always return 400 for bad signatures to prevent replay attacks
    return send(
      event,
      400,
      `Webhook Error: Signature verification failed - ${error.message}`
    );
  }

  try {
    const subscription = await getSubscriptionFromEvent(stripe, stripeEvent);

    if (!subscription) {
      console.warn(
        `[webhook] No relevant subscription found for event type: ${stripeEvent.type} (ID: ${stripeEvent.id}). Skipping DB update.`
      );
      // It's okay to return success if the event type isn't relevant to subscriptions
      return { received: true };
    }

    // IMPORTANT: Access 'supabase_user_id' as that's what's being set in the Checkout Session API
    const userId = subscription.metadata?.supabase_user_id;

    if (!userId || typeof userId !== "string") {
      console.error(
        `[webhook] Missing or invalid 'supabase_user_id' in subscription metadata for event: ${stripeEvent.type}. Subscription ID: ${subscription.id}. This is critical for linking to Supabase user.`
      );
      // If the user ID is missing, you cannot link the subscription.
      // This indicates a misconfiguration in how the Checkout Session was created.
      return send(
        event,
        400,
        "Missing 'supabase_user_id' in subscription metadata. Cannot process."
      );
    }

    const subscriptionData = toSubscriptionModel(subscription);

    // Perform upsert (insert or update) operation on your subscriptions table
    const { error: upsertError } = await supabaseAdmin
      .from("subscriptions")
      .upsert(subscriptionData, {
        onConflict: "stripe_subscription_id", // Use Stripe's unique ID for conflict resolution
        ignoreDuplicates: false, // Ensure updates happen for existing records
      });

    if (upsertError) {
      console.error(
        `[webhook] Supabase upsert error for subscription ${subscription.id} (user: ${userId}):`,
        upsertError
      );
      return send(event, 500, `Database error: ${upsertError.message}`);
    }

    console.log(
      `[webhook] Successfully processed event: ${stripeEvent.type}, subscription: ${subscription.id} for user: ${userId}`
    );
    return { received: true };
  } catch (error: any) {
    console.error(
      `[webhook] Unhandled error during event processing: ${error.message}`,
      error
    );
    // Return 500 for internal server errors to Stripe, so they can retry
    return send(event, 500, `Internal Server Error: ${error.message}`);
  }
});
