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

  const { protocol, host } = event.node.req.headers;
  const siteUrl =
    (protocol ? `${protocol}://` : "https://") +
    (host || process.env.NUXT_PUBLIC_SITE_URL || "localhost:3000");
  const returnUrl = `${siteUrl}${
    redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`
  }`;

  // Fetch the user's profile to get their stripe_customer_id
  const { data: subscription, error: subscriptionError } =
    await supabaseAdminClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("id", user.id)
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
      customer: profile.stripe_customer_id,
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
