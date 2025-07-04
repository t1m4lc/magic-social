import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/supabase/supabase";

interface PlanLimitResponse {
  dailyLimit: number;
}

const notFoundError = (planType: string) => {
  throw createError({
    statusCode: 404,
    statusMessage: `No rate limit settings found for plan type '${planType}'`,
  });
};

export default defineCachedEventHandler(
  async (event): Promise<PlanLimitResponse> => {
    const planType = getRouterParam(event, "planType");

    if (!planType || !["free", "pro", "ultimate"].includes(planType)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Invalid plan type. Must be 'free', 'pro', or 'ultimate'",
      });
    }

    const client = await serverSupabaseClient<Database>(event);

    try {
      const { data, error } = await client
        .from("rate_limit_settings")
        .select("daily_limit")
        .eq("plan_type", planType)
        .eq("is_active", true)
        .single();

      if (error) {
        // PGRST116 = no rows returned
        if (error.code === "PGRST116") {
          notFoundError(planType);
        }
        console.error(`Error fetching rate limit for ${planType}:`, error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to fetch rate limit settings",
        });
      }

      if (!data) {
        notFoundError(planType);
      }

      return {
        dailyLimit: data.daily_limit,
      };
    } catch (err: any) {
      if (err.statusCode) {
        throw err;
      }
      console.error(`Failed to fetch rate limit for ${planType}:`, err);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      });
    }
  },
  {
    maxAge: 60 * 60 * 24,
    getKey: (event) => {
      const planType = getRouterParam(event, "planType");
      return `limit-${planType}`;
    },
    group: "rate-limits",
  }
);
