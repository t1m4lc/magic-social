import { serverSupabaseServiceRole } from "#supabase/server";
import { Stripe } from "stripe";
import { Database, TablesInsert } from "~/supabase/supabase";

// SECTION 1: TYPES
// -----------------------------------------------------------------------------
type SupabaseClientAdmin = ReturnType<
  typeof serverSupabaseServiceRole<Database>
>;
type StripeSubscription = Stripe.Subscription;
type StripeCheckoutSession = Stripe.Checkout.Session;
type StripeCustomer = Stripe.Customer;
type StripeInvoice = Stripe.Invoice & { subscription?: string };

interface RelevantTimestamps {
  readonly currentPeriodStart: number | null;
  readonly currentPeriodEnd: number | null;
  readonly canceledAt: number | null;
  readonly endedAt: number | null;
  readonly trialStart: number | null;
  readonly trialEnd: number | null;
}

// SECTION 2: PURE HELPER FUNCTIONS (Data Extraction, Transformation)
// -----------------------------------------------------------------------------

function getStripeCustomerID(
  subOrCustomer: StripeSubscription | StripeCustomer | string | null
): string | null {
  if (!subOrCustomer) return null;
  if (typeof subOrCustomer === "string") return subOrCustomer;
  if ("customer" in subOrCustomer && subOrCustomer.customer) {
    const customer = subOrCustomer.customer;
    return typeof customer === "string" ? customer : customer.id;
  }
  if ("id" in subOrCustomer) {
    return subOrCustomer.id;
  }
  return null;
}

function getSupabaseUserIDFromMetadata(sub: StripeSubscription): string | null {
  if (sub.metadata?.supabase_user_id) {
    return sub.metadata.supabase_user_id;
  }
  if (
    typeof sub.customer === "object" &&
    sub.customer !== null && // Ensure customer is not null
    (sub.customer as StripeCustomer).metadata?.supabase_user_id
  ) {
    return (sub.customer as StripeCustomer).metadata.supabase_user_id;
  }
  return null;
}

function getStripePriceIDFromSubscription(
  sub: StripeSubscription
): string | null {
  return sub.items.data[0]?.price.id ?? null;
}

function getRelevantTimestamps(sub: StripeSubscription): RelevantTimestamps {
  // Prioritize from subscription item as previously determined and validated
  const itemPeriodStart = sub.items.data[0]?.current_period_start ?? null;
  const itemPeriodEnd = sub.items.data[0]?.current_period_end ?? null;

  // Fallback to direct properties if not on item or not numbers (Stripe types can be complex)
  // This casting was present in the previously working version and handles cases where
  // the direct properties might exist on the object Stripe sends, even if not strictly typed at the top level.
  const currentPeriodStart =
    typeof itemPeriodStart === "number"
      ? itemPeriodStart
      : (((sub as any).current_period_start ?? null) as number | null);
  const currentPeriodEnd =
    typeof itemPeriodEnd === "number"
      ? itemPeriodEnd
      : (((sub as any).current_period_end ?? null) as number | null);

  return {
    currentPeriodStart,
    currentPeriodEnd,
    canceledAt: sub.canceled_at,
    endedAt: sub.ended_at,
    trialStart: sub.trial_start,
    trialEnd: sub.trial_end,
  };
}

function convertUnixToISO(
  timestamp: number | null
  // fieldName: string, // No longer needed for logging
  // subId: string // No longer needed for logging
): string | null {
  if (timestamp === null || typeof timestamp === "undefined") return null;
  // No warning for invalid type, rely on TypeScript for type safety.
  // If an invalid type somehow gets here, it will likely cause a runtime error,
  // which should be caught by a higher-level error handler.
  return new Date(timestamp * 1000).toISOString();
}

function buildSubscriptionUpsertPayload(
  supabaseUserId: string,
  stripePriceId: string,
  sub: StripeSubscription,
  timestamps: RelevantTimestamps
): TablesInsert<"subscriptions"> {
  const subId = sub.id;
  const stripeCustomerId = getStripeCustomerID(sub);

  if (!stripeCustomerId) {
    // This error is critical for payload construction.
    throw new Error(
      `Failed to extract Stripe Customer ID for subscription ${subId}`
    );
  }

  return {
    stripe_subscription_id: subId,
    user_id: supabaseUserId,
    stripe_price_id: stripePriceId,
    stripe_customer_id: stripeCustomerId,
    status: sub.status,
    current_period_start: convertUnixToISO(timestamps.currentPeriodStart),
    current_period_end: convertUnixToISO(timestamps.currentPeriodEnd),
    cancel_at_period_end: sub.cancel_at_period_end,
    canceled_at: convertUnixToISO(timestamps.canceledAt),
    ended_at: convertUnixToISO(timestamps.endedAt),
    trial_start: convertUnixToISO(timestamps.trialStart),
    trial_end: convertUnixToISO(timestamps.trialEnd),
    metadata: sub.metadata,
  };
}

// SECTION 3: DATABASE INTERACTION FUNCTIONS
// -----------------------------------------------------------------------------

async function upsertSupabaseSubscription(
  supabase: SupabaseClientAdmin,
  payload: TablesInsert<"subscriptions">
): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "stripe_subscription_id" });

  if (error) {
    // Return error to be handled by caller
    return { success: false, error };
  }
  return { success: true };
}

async function updateSubscriptionStatusInDb(
  supabase: SupabaseClientAdmin,
  stripeSubscriptionId: string,
  status: StripeSubscription["status"]
): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status })
    .eq("stripe_subscription_id", stripeSubscriptionId);
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}

// SECTION 4: CORE STRIPE DATA PROCESSING LOGIC
// -----------------------------------------------------------------------------

async function resolveSupabaseUserId(
  sub: StripeSubscription,
  _supabase: SupabaseClientAdmin
): Promise<string | null> {
  // Only use metadata for user resolution
  const supabaseUserId = getSupabaseUserIDFromMetadata(sub);
  return supabaseUserId || null;
}

async function syncSubscriptionDataCore(
  supabase: SupabaseClientAdmin,
  sub: StripeSubscription,
  stripeInstance: Stripe
): Promise<{ success: boolean; error?: string | object }> {
  const subId = sub.id;

  const supabaseUserId = await resolveSupabaseUserId(sub, supabase);
  if (!supabaseUserId) {
    return {
      success: false,
      error: `Supabase User ID could not be resolved from subscription metadata for Stripe subscription ${subId}.`,
    };
  }

  const stripePriceId = getStripePriceIDFromSubscription(sub);
  if (!stripePriceId) {
    return {
      success: false,
      error: `Stripe Price ID not found on subscription ${subId}.`,
    };
  }

  const timestamps = getRelevantTimestamps(sub);

  if (
    ["active", "trialing", "past_due"].includes(sub.status) &&
    (typeof timestamps.currentPeriodStart !== "number" ||
      typeof timestamps.currentPeriodEnd !== "number")
  ) {
    const errorDetail = `Subscription ${subId} (status: ${sub.status}) has invalid/missing current_period_start/end. Start: ${timestamps.currentPeriodStart}, End: ${timestamps.currentPeriodEnd}.`;
    return { success: false, error: errorDetail };
  }

  try {
    const payload = buildSubscriptionUpsertPayload(
      supabaseUserId,
      stripePriceId,
      sub,
      timestamps
    );
    const upsertResult = await upsertSupabaseSubscription(supabase, payload);
    if (!upsertResult.success) {
      return {
        success: false,
        error: upsertResult.error || `Failed to upsert subscription ${subId}.`,
      };
    }
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: `Error building subscription payload for ${subId}: ${error.message}`,
    };
  }
}

// SECTION 5: STRIPE EVENT HANDLERS
// -----------------------------------------------------------------------------
// Helper to reduce repetition in event handlers
async function retrieveAndSyncSubscription(
  subscriptionId: string,
  stripe: Stripe,
  supabase: SupabaseClientAdmin,
  eventName: string // For context if errors occur
): Promise<{ success: boolean; error?: string | object }> {
  try {
    const fullSubscription = await stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ["items.data.price.product", "customer"],
      }
    );
    return await syncSubscriptionDataCore(supabase, fullSubscription, stripe);
  } catch (retrieveError: any) {
    return {
      success: false,
      error: `Error retrieving full subscription ${subscriptionId} for event ${eventName}: ${retrieveError.message}`,
    };
  }
}

async function handleSubscriptionLifecycleEvent(
  eventData: Stripe.Event.Data,
  stripe: Stripe,
  supabase: SupabaseClientAdmin,
  eventType: string
): Promise<{ success: boolean; error?: string | object }> {
  const eventSubscription = eventData.object as StripeSubscription;
  // console.log for event and sub ID removed

  const syncResult = await retrieveAndSyncSubscription(
    eventSubscription.id,
    stripe,
    supabase,
    eventType
  );

  if (!syncResult.success) {
    if (
      eventType === "customer.subscription.deleted" &&
      (syncResult.error as any)?.message?.includes("No such subscription")
    ) {
      // Attempt sync with event data as a fallback ONLY if retrieve failed for a deleted event
      return await syncSubscriptionDataCore(
        supabase,
        eventSubscription,
        stripe
      );
    }
    return syncResult;
  }
  return syncResult;
}

async function handleCheckoutSessionCompleted(
  session: StripeCheckoutSession,
  stripe: Stripe,
  supabase: SupabaseClientAdmin
): Promise<{ success: boolean; error?: string | object } | void> {
  if (
    session.mode === "subscription" &&
    session.subscription &&
    session.customer
  ) {
    // Fetch the subscription from Stripe
    const fullSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price.product", "customer"],
      }
    );
    // Patch: If supabase_user_id is missing from subscription metadata, inject from session
    if (
      !fullSubscription.metadata?.supabase_user_id &&
      session.metadata?.supabase_user_id
    ) {
      fullSubscription.metadata = {
        ...fullSubscription.metadata,
        supabase_user_id: session.metadata.supabase_user_id,
      };
    }
    return await syncSubscriptionDataCore(supabase, fullSubscription, stripe);
  } else {
    // Not an error, just not a relevant event for subscription sync
    return {
      success: true,
      error: "Not a subscription checkout session or missing data.",
    };
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: StripeInvoice,
  stripe: Stripe,
  supabase: SupabaseClientAdmin
): Promise<{ success: boolean; error?: string | object } | void> {
  if (invoice.subscription) {
    return await retrieveAndSyncSubscription(
      invoice.subscription,
      stripe,
      supabase,
      "invoice.payment_succeeded"
    );
  } else {
    return { success: true, error: "Invoice paid but no subscription linked." }; // Or return void
  }
}

async function handleInvoicePaymentFailed(
  invoice: StripeInvoice,
  supabase: SupabaseClientAdmin
): Promise<{ success: boolean; error?: string | object } | void> {
  if (invoice.subscription) {
    const updateResult = await updateSubscriptionStatusInDb(
      supabase,
      invoice.subscription as string,
      "past_due"
    );
    if (!updateResult.success) {
      return {
        success: false,
        error:
          updateResult.error ||
          `Failed to mark subscription ${invoice.subscription} as past_due.`,
      };
    }
    return { success: true };
  } else {
    return {
      success: true,
      error: "Invoice payment failed but no subscription linked.",
    };
  }
}

// SECTION 6: MAIN WEBHOOK DISPATCHER & ENTRYPOINT
// -----------------------------------------------------------------------------

async function processStripeEvent(
  stripeEvent: Stripe.Event,
  stripe: Stripe,
  supabase: SupabaseClientAdmin
): Promise<{
  processed: boolean;
  success?: boolean;
  error?: string | object;
  eventType?: string;
}> {
  const { type, data } = stripeEvent;
  let result: { success: boolean; error?: string | object } | void;

  switch (type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.resumed":
      result = await handleSubscriptionLifecycleEvent(
        data,
        stripe,
        supabase,
        type
      );
      break;
    case "checkout.session.completed":
      result = await handleCheckoutSessionCompleted(
        data.object as StripeCheckoutSession,
        stripe,
        supabase
      );
      break;
    case "invoice.payment_succeeded":
      result = await handleInvoicePaymentSucceeded(
        data.object as StripeInvoice,
        stripe,
        supabase
      );
      break;
    case "invoice.payment_failed":
      result = await handleInvoicePaymentFailed(
        data.object as StripeInvoice,
        supabase
      );
      break;
    default:
      // This is not an error for Stripe, but good for us to know.
      // We can log this specifically in the main handler if desired.
      return {
        processed: true,
        success: true,
        error: `Unhandled event type: ${type}`,
        eventType: type,
      };
  }

  if (result && !result.success) {
    return {
      processed: true,
      success: false,
      error: result.error,
      eventType: type,
    };
  }
  return { processed: true, success: true, eventType: type };
}

export const config = {
  bodyParser: false, // Stripe requires raw body for signature verification
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);

  const sig = event.node.req.headers["stripe-signature"] as string;
  const rawBody = await readRawBody(event);

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody!,
      sig,
      config.stripeWebhookSecret
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return send(event, 400, "Webhook Error");
  }

  // Dispatch to your existing event processing logic
  const supabase = serverSupabaseServiceRole<Database>(event);
  const result = await processStripeEvent(stripeEvent, stripe, supabase);

  // Optionally log or handle errors here
  if (result && result.error) {
    console.error("Stripe webhook processing error:", result.error);
  }

  return { received: true };
});
