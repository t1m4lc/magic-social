import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/supabase/supabase";

interface SubscriptionResponse {
  planType: string;
  customerId: string | null;
  subscriptionId: string | null;
}

export default defineEventHandler(
  async (event): Promise<SubscriptionResponse> => {
    const client = await serverSupabaseClient<Database>(event);

    try {
      const user = await serverSupabaseUser(event);

      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: "Authentication required",
        });
      }

      const { data: profile } = await client
        .from("profiles")
        .select("plan_type, stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .single();

      return {
        planType: profile?.plan_type || "free",
        customerId: profile?.stripe_customer_id || null,
        subscriptionId: profile?.stripe_subscription_id || null,
      };
    } catch (err: any) {
      if (err.statusCode) {
        throw err;
      }
      console.error("Error fetching subscription:", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch subscription",
      });
    }
  }
);
