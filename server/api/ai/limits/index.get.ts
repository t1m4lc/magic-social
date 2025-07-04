import { serverSupabaseClient } from "#supabase/server";
import type { Database, Tables } from "~/supabase/supabase";

type RateLimitSettings = Tables<"rate_limit_settings">;

interface RateLimitResponse {
  settings: Record<string, RateLimitSettings>;
  defaultLimits: Record<string, number>;
}

// Cache all rate limit settings for 10 minutes since they rarely change
export default defineCachedEventHandler(
  async (event): Promise<RateLimitResponse> => {
    const client = await serverSupabaseClient<Database>(event);
    const defaultLimits: Record<string, number> = {
      free: 0,
      pro: 10,
      ultimate: 50,
    };

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

      // Transform array to object keyed by plan_type
      const settingsByPlan: Record<string, RateLimitSettings> = {};
      (data || []).forEach((setting) => {
        settingsByPlan[setting.plan_type] = setting;
      });

      return {
        settings: settingsByPlan,
        defaultLimits,
      };
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
    maxAge: 60 * 60 * 24,
    // Single cache key for all settings
    getKey: () => "all-limits",
    // Group for cache invalidation
    group: "rate-limits",
  }
);
