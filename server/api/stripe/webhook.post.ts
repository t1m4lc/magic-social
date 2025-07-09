import { defineEventHandler, readRawBody, send } from "h3";
import { useServerStripe } from "#stripe/server";
import type Stripe from "stripe";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database, TablesInsert } from "~/supabase/supabase";

const toSubscriptionModel = (
  subscription: Stripe.Subscription
): TablesInsert<"subscriptions"> => {
  const current_period_start = (subscription as any)["current_period_start"] as
    | number
    | undefined;
  const current_period_end = (subscription as any)["current_period_end"] as
    | number
    | undefined;
  return {
    user_id: subscription.metadata.user_id, // This will now come from the metadata passed during checkout
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    stripe_price_id: subscription.items.data[0]?.price.id,
    status: subscription.status,
    metadata: subscription.metadata,
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
        subscription?: string;
      };
      if (!invoice.subscription || typeof invoice.subscription !== "string")
        return null;
      return await stripe.subscriptions.retrieve(invoice.subscription);
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) return null;

      // When checkout.session.completed, the subscription object created by Stripe
      // will inherit metadata from the checkout session.
      // So, we retrieve the subscription, and its metadata will contain user_id.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      return subscription;
    }
    default:
      return null;
  }
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = await useServerStripe(event);
  const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

  const signature = event.node.req.headers["stripe-signature"] as string;
  const rawBody = await readRawBody(event);

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      rawBody!,
      signature,
      config.stripeWebhookSecret
    );
  } catch (error: any) {
    console.error(`[webhook] Error verifying signature: ${error.message}`);
    return send(event, 400, `Webhook Error: ${error.message}`);
  }

  try {
    const subscription = await getSubscriptionFromEvent(stripe, stripeEvent);
    if (!subscription) {
      console.warn(
        `[webhook] No subscription found for event: ${stripeEvent.type}`
      );
      return { received: true };
    }

    // Now, subscription.metadata.user_id should reliably contain the Supabase user ID
    const userId = subscription.metadata?.user_id;

    if (!userId || typeof userId !== "string") {
      console.error(
        `[webhook] Missing or invalid user_id in subscription metadata for event: ${stripeEvent.type}. Subscription ID: ${subscription.id}`
      );
      // This indicates a setup issue where user_id wasn't passed during checkout session creation.
      return send(
        event,
        400,
        "Missing user_id in subscription metadata. Ensure user_id is passed during checkout session creation."
      );
    }

    // Ensure the metadata passed to toSubscriptionModel includes the user_id
    // This is generally redundant if user_id is already in metadata, but good for clarity.
    const subscriptionData = toSubscriptionModel(subscription);

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .upsert(subscriptionData, { onConflict: "stripe_subscription_id" }); // Consider your primary key strategy here.

    if (error) {
      console.error("[webhook] Supabase upsert error:", error);
      return send(event, 500, "Database error");
    }
    console.log(
      `[webhook] Processed event: ${stripeEvent.type}, subscription: ${subscription.id} for user: ${userId}`
    );
    return { received: true };
  } catch (error: any) {
    console.error(`[webhook] Unhandled error: ${error.message}`);
    return send(event, 500, "Internal Server Error");
  }
});
