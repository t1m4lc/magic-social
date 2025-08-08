import { useServerStripe } from "#stripe/server";
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const supabaseAdminClient = serverSupabaseServiceRole<Database>(event);
  const stripe = await useServerStripe(event);

  // Get the redirect path from the query, default to /dashboard
  const query = getQuery(event);
  const redirectPath =
    typeof query.redirect === "string" ? query.redirect : "/dashboard";

  // Use improved header parsing like in checkout-session
  const host = event.node.req.headers.host;
  const forwardedHost = event.node.req.headers["x-forwarded-host"];
  const forwardedProto = event.node.req.headers["x-forwarded-proto"];

  const actualHost = forwardedHost || host;
  const actualProtocol =
    forwardedProto ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const siteUrl = `${actualProtocol}://${actualHost}`;

  const returnUrl = `${siteUrl}${
    redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`
  }`;

  const { data: subscription, error: subscriptionError } =
    await supabaseAdminClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

  if (subscriptionError || !subscription || !subscription.stripe_customer_id) {
    console.error(
      `[Customer Portal] Error fetching profile or missing Stripe customer ID for user ${user.id}:`,
      subscriptionError
    );
    throw createError({
      statusCode: 500,
      message: "Could not retrieve customer information.",
    });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl,
    });

    return { portalUrl: portalSession.url };
  } catch (e: any) {
    console.error(
      `[Customer Portal] Error creating Stripe Billing Portal session for user ${user.id}:`,
      e
    );
    throw createError({
      statusCode: 500,
      message: e.message || "Failed to create customer portal session.",
    });
  }
});
