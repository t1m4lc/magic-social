// server/api/user/current-subscription.get.ts
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { createError } from "h3";
import { Database } from "~/supabase/supabase";
import { getPlanTypeWithPriceId } from "~/shared/price.util";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const userId = user.id;
  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("subscriptions")
    .select("stripe_price_id")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("current_period_end", { ascending: false })
    .limit(1);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  const stripePriceId = data?.[0]?.stripe_price_id ?? null;
  const planType = getPlanTypeWithPriceId(stripePriceId);

  return { stripePriceId, planType };
});
