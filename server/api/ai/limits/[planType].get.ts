import { serverSupabaseClient } from "#supabase/server";
import type { Database, Tables } from "~/supabase/supabase";

type RateLimitSettings = Tables<"rate_limit_settings">;

// Cache all rate limit settings for 24 hours since they rarely change
export default defineCachedEventHandler(
  async (event): Promise<Record<string, RateLimitSettings>> => {
    const client = await serverSupabaseClient<Database>(event);

    try {
      const { data, error } = await client
        .from("rate_limit_settings")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching rate limit settings:", error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to fetch rate limit settings",
        });
      }

      if (!data || data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "No rate limit settings found",
        });
      }

      // Transform array to object keyed by plan_type
      const settingsByPlan: Record<string, RateLimitSettings> = {};
      data.forEach((setting) => {
        settingsByPlan[setting.plan_type] = setting;
      });

      return settingsByPlan;
    } catch (err: any) {
      // If it's already a createError, re-throw it
      if (err.statusCode) {
        throw err;
      }

      console.error("Failed to fetch rate limit settings:", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      });
    }
  },
  {
    // Cache for 1 week
    maxAge: 60 * 60 * 24 * 7,
    // Single cache key for all settings
    getKey: () => "all-limits",
    // Group for cache invalidation
    group: "rate-limits",
  }
);
