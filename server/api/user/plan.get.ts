import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { convertPriceIdToPlanType } from "~/shared/price.util";
import { Database } from "~/supabase/supabase";

export default defineCachedEventHandler(
  async (event) => {
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);

    const { data: subscription, error: profileError } = await supabase
      .from("subscriptions")
      .select("stripe_price_id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !subscription.stripe_price_id) {
      console.error("Error fetching user profile:", profileError);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not retrieve user profile",
      });
    }

    return {
      plan_type: convertPriceIdToPlanType(subscription.stripe_price_id),
    };
  },
  {
    maxAge: 60 * 60 * 24,
    name: "user-plan",
    getKey: (event) =>
      serverSupabaseUser(event).then((user) => user?.id || "anonymous"),
  }
);
