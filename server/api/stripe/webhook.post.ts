import { serverSupabaseServiceRole } from "#supabase/server";
import Stripe from "stripe";
import { useServerStripe } from "#stripe/server";

type WebhookHandler = (data: any, serviceRole: any) => Promise<void>;

const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
  serviceRole: any
) => {
  if (session.mode !== "subscription") {
    console.log("Skipping non-subscription checkout session");
    return;
  }

  const userId = session.metadata?.supabase_user_id;
  const planId = session.metadata?.plan_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !planId) {
    console.error("Missing metadata in checkout session:", session.id);
    throw new Error("Missing required metadata");
  }

  const { error } = await serviceRole.from("profiles").upsert({
    id: userId,
    plan_type: planId,
    subscription_status: "active",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  console.log(`Successfully upgraded user ${userId} to ${planId} plan`);
};

const handleSubscriptionUpdated = async (
  subscription: Stripe.Subscription,
  serviceRole: any
) => {
  const customerId = subscription.customer as string;

  const { data: profile, error: fetchError } = await serviceRole
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (fetchError || !profile) {
    console.warn(`No profile found for customer ${customerId}`, { fetchError });
    return;
  }

  const isActive = ["active", "trialing"].includes(subscription.status);

  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      // Update plan_type based on subscription status
      ...(isActive ? {} : { plan_type: "free" }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Error updating subscription:", updateError);
    throw updateError;
  }

  console.log(
    `Updated subscription for user ${profile.id}: ${subscription.status}`
  );
};

const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription,
  serviceRole: any
) => {
  const customerId = subscription.customer as string;

  const { data: profile, error: fetchError } = await serviceRole
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (fetchError || !profile) {
    console.warn(`No profile found for customer ${customerId}`, { fetchError });
    return;
  }

  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      plan_type: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Error downgrading to free plan:", updateError);
    throw updateError;
  }

  console.log(`Downgraded user ${profile.id} to free plan`);
};

const handleInvoicePaymentSucceeded = async (
  invoice: Stripe.Invoice,
  serviceRole: any
) => {
  const customerId = invoice.customer as string;

  const { data: profile, error: fetchError } = await serviceRole
    .from("profiles")
    .select("id, subscription_status")
    .eq("stripe_customer_id", customerId)
    .single();

  if (fetchError || !profile) {
    console.warn(`No profile found for customer ${customerId}`, { fetchError });
    return;
  }

  // Only update if the user was in a problematic state
  if (["past_due", "unpaid"].includes(profile.subscription_status)) {
    const { error: updateError } = await serviceRole
      .from("profiles")
      .update({
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Failed to update payment recovery:", updateError);
      throw updateError;
    }

    console.log(
      `User ${profile.id} payment recovered, subscription reactivated`
    );
  }
};

const handleInvoicePaymentFailed = async (
  invoice: Stripe.Invoice,
  serviceRole: any
) => {
  const customerId = invoice.customer as string;

  const { data: profile, error: fetchError } = await serviceRole
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (fetchError || !profile) {
    console.warn(`No profile found for customer ${customerId}`, { fetchError });
    return;
  }

  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Failed to update payment failure:", updateError);
    throw updateError;
  }

  console.log(`User ${profile.id} payment failed - marked as past_due`);
};

// Event handler mapping for better organization
const webhookHandlers: Record<string, WebhookHandler> = {
  "checkout.session.completed": handleCheckoutCompleted,
  "customer.subscription.updated": handleSubscriptionUpdated,
  "customer.subscription.deleted": handleSubscriptionDeleted,
  "invoice.payment_succeeded": handleInvoicePaymentSucceeded,
  "invoice.payment_failed": handleInvoicePaymentFailed,
};

const handleWebhookEvent = async (
  stripeEvent: Stripe.Event,
  serviceRole: any
) => {
  const handler = webhookHandlers[stripeEvent.type];

  if (handler) {
    await handler(stripeEvent.data.object, serviceRole);
  } else {
    console.log(`Unhandled event type: ${stripeEvent.type}`);
  }
};

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  }

  const stripe = await useServerStripe(event);
  const serviceRole = serverSupabaseServiceRole(event);

  const body = await readRawBody(event);
  const signature = getHeader(event, "stripe-signature");

  if (!signature || !body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Stripe signature or body",
    });
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid signature",
    });
  }

  try {
    await handleWebhookEvent(stripeEvent, serviceRole);
    return { received: true };
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Webhook processing failed",
    });
  }
});
