import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";
import type { Database } from "~/supabase/supabase";
import { z } from "zod";
import { useServerStripe } from "#stripe/server";

// Types
interface CheckoutRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutResponse {
  url: string;
  sessionId: string;
}

// Validation schema
const checkoutRequestSchema = z.object({
  planId: z.enum(["pro", "ultimate"]),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// Pure functions
const getPlanPriceId = (planId: string): string | null => {
  const priceIds: Record<string, string | undefined> = {
    pro: process.env.STRIPE_PRO_PRICE_ID,
    ultimate: process.env.STRIPE_ULTIMATE_PRICE_ID,
  };

  return priceIds[planId] || null;
};

const buildSuccessUrl = (baseUrl: string, customUrl?: string): string =>
  customUrl || `${baseUrl}/dashboard?success=true`;

const buildCancelUrl = (baseUrl: string, customUrl?: string): string =>
  customUrl || `${baseUrl}/pricing?canceled=true`;

const createCustomerMetadata = (userId: string) => ({
  supabase_user_id: userId,
});

const createSessionMetadata = (userId: string, planId: string) => ({
  supabase_user_id: userId,
  plan_id: planId,
});

// Async helper functions
const authenticateUser = async (client: any) => {
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return user;
};

const fetchUserProfile = async (client: any, userId: string) => {
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user profile",
    });
  }

  return profile;
};

const createStripeCustomer = async (
  stripe: any,
  email: string,
  userId: string
) => {
  const customer = await stripe.customers.create({
    email,
    metadata: createCustomerMetadata(userId),
  });

  return customer.id;
};

const updateProfileCustomerId = async (
  serviceRole: any,
  userId: string,
  customerId: string
) => {
  const { error: updateError } = await serviceRole
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating customer ID:", updateError);
  }
};

const ensureCustomer = async (
  stripe: any,
  serviceRole: any,
  profile: any,
  user: any
): Promise<string> => {
  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const email = profile?.email || user.email;
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required to create a Stripe customer",
    });
  }

  const customerId = await createStripeCustomer(stripe, email, user.id);

  await updateProfileCustomerId(serviceRole, user.id, customerId);

  return customerId;
};

const createCheckoutSession = async (
  stripe: any,
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  userId: string,
  planId: string
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: createSessionMetadata(userId, planId),
  });

  if (!session.url) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create checkout session",
    });
  }

  return session;
};

// Main handler
export default defineEventHandler(async (event): Promise<CheckoutResponse> => {
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  }

  const body = await readBody<CheckoutRequest>(event);

  // Validate request body
  const validation = checkoutRequestSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid request: ${validation.error.issues
        .map((i) => i.message)
        .join(", ")}`,
    });
  }

  const { planId, successUrl, cancelUrl } = validation.data;
  const baseUrl = getRequestURL(event).origin;

  try {
    const client = await serverSupabaseClient<Database>(event);
    const serviceRole = serverSupabaseServiceRole(event);
    const stripe = await useServerStripe(event);

    // Get price ID from environment (Stripe source of truth)
    const priceId = getPlanPriceId(planId);

    // Handle Ultimate plan not being available yet
    if (planId === "ultimate" && !priceId) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Ultimate plan is coming soon and not yet available for purchase",
      });
    }

    if (!priceId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid plan configuration - missing price ID",
      });
    }

    // Authenticate user
    const user = await authenticateUser(client);

    // Fetch user profile
    const profile = await fetchUserProfile(client, user.id);

    // Ensure Stripe customer exists
    const customerId = await ensureCustomer(stripe, serviceRole, profile, user);

    // Build URLs
    const resolvedSuccessUrl = buildSuccessUrl(baseUrl, successUrl);
    const resolvedCancelUrl = buildCancelUrl(baseUrl, cancelUrl);

    // Create checkout session (Stripe will handle pricing from the price ID)
    const session = await createCheckoutSession(
      stripe,
      customerId,
      priceId,
      resolvedSuccessUrl,
      resolvedCancelUrl,
      user.id,
      planId
    );

    return {
      url: session.url,
      sessionId: session.id,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    console.error("Stripe checkout error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create checkout session",
    });
  }
});
