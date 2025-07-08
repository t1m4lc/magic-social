import { serverSupabaseServiceRole } from "#supabase/server";
import Stripe from "stripe";
import { useServerStripe } from "#stripe/server";
import { getRequestHeader, readRawBody, createError } from "h3";
import { useRuntimeConfig } from "#imports";

// --- Types ---
type WebhookHandler = (data: any, serviceRole: any) => Promise<void>;

// --- Event Handlers ---
const handleCheckoutCompleted: WebhookHandler = async (
  session,
  serviceRole
) => {
  console.log("[webhook] checkout.session.completed received:", {
    id: session.id,
    customer: session.customer,
    metadata: session.metadata,
    subscription: session.subscription,
    mode: session.mode,
    status: session.status,
  });

  const userId = session.metadata?.supabase_user_id;
  const planId = session.metadata?.plan_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const status = session.status === "complete" ? "active" : "trialing";
  if (!userId || !planId) {
    console.error("Missing metadata in checkout session:", session.id);
    throw new Error("Missing required metadata");
  }
  // Idempotent upsert
  const { error } = await serviceRole.from("profiles").upsert({
    id: userId,
    plan_type: planId,
    subscription_status: status,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    updated_at: new Date().toISOString(),
  });

  console.log("[webhook] Upserting profile with:", {
    id: userId,
    plan_type: planId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    subscription_status: status,
  });

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  console.log(`Successfully upgraded user ${userId} to ${planId} plan`);
};

const handleSubscriptionCreated: WebhookHandler = async (
  subscription,
  serviceRole
) => {
  const customerId = subscription.customer as string;
  const planId = subscription.items.data[0]?.price?.id ?? null;
  const status = subscription.status;
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
      plan_type: planId,
      subscription_status: status,
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) {
    console.error("Error updating subscription (created):", updateError);
    throw updateError;
  }
  console.log(`Created subscription for user ${profile.id}: ${status}`);
};

const handleSubscriptionUpdated: WebhookHandler = async (
  subscription,
  serviceRole
) => {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const planId = subscription.items.data[0]?.price?.id ?? null;
  const { data: profile, error: fetchError } = await serviceRole
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (fetchError || !profile) {
    console.warn(`No profile found for customer ${customerId}`, { fetchError });
    return;
  }
  const isActive = ["active", "trialing"].includes(status);
  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      subscription_status: status,
      stripe_subscription_id: subscription.id,
      ...(isActive ? { plan_type: planId } : { plan_type: "free" }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) {
    console.error("Error updating subscription (updated):", updateError);
    throw updateError;
  }
  console.log(`Updated subscription for user ${profile.id}: ${status}`);
};

const handleSubscriptionDeleted: WebhookHandler = async (
  subscription,
  serviceRole
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
  }
  console.log(`Downgraded user ${profile.id} to free plan`);
};

const handleInvoicePaymentSucceeded: WebhookHandler = async (
  invoice,
  serviceRole
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
  // Optionally update renewal date, payment status, etc.
  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) {
    console.error("Error updating after payment succeeded:", updateError);
  }
  console.log(`Payment succeeded for user ${profile.id}`);
};

const handleInvoicePaymentFailed: WebhookHandler = async (
  invoice,
  serviceRole
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
  // Optionally update status, send alert, etc.
  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) {
    console.error("Error updating after payment failed:", updateError);
  }
  console.log(`Payment failed for user ${profile.id}`);
};

// --- Main Webhook Handler ---
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = await useServerStripe(event);
  const serviceRole = serverSupabaseServiceRole(event);
  const sig = getRequestHeader(event, "stripe-signature");
  const secret = config.stripeWebhookSecret;
  if (!sig || !secret) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Stripe signature or webhook secret",
    });
  }
  let stripeEvent: Stripe.Event;
  try {
    const rawBody = await readRawBody(event);
    if (!rawBody) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing request body",
      });
    }
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook Error: ${err.message}`,
    });
  }
  // Event routing
  const { type, data } = stripeEvent;
  try {
    switch (type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(data.object, serviceRole);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(data.object, serviceRole);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(data.object, serviceRole);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(data.object, serviceRole);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(data.object, serviceRole);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(data.object, serviceRole);
        break;
      default:
        console.log(`Ignoring irrelevant event: ${type}`);
    }
  } catch (err: any) {
    console.error(`Error handling event ${type}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: `Webhook handler error: ${err.message}`,
    });
  }
  return { received: true };
});
