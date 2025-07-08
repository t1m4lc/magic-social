import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import type { Database } from "~/supabase/supabase";

interface UserLimitResponse {
  dailyLimit: number;
  usage: number;
  remaining: number;
  plan: string;
}

export default defineEventHandler(async (event): Promise<UserLimitResponse> => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const service = serverSupabaseServiceRole<Database>(event);

  try {
    console.error("USER____ID", user.id);

    // 1. Get user's plan
    const { data: userProfile, error: profileError } = await service
      .from("profiles")
      .select("plan_type")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not retrieve user profile",
      });
    }

    const planType = userProfile.plan_type || "free";

    // 2. Get rate limit for the plan
    const { data: rateLimitSettings, error: rateLimitError } = await client
      .from("rate_limit_settings")
      .select("daily_limit")
      .eq("plan_type", planType)
      .eq("is_active", true)
      .single();

    if (rateLimitError || !rateLimitSettings) {
      console.error(
        `Error fetching rate limits for ${planType}:`,
        rateLimitError
      );
      throw createError({
        statusCode: 500,
        statusMessage: "Could not retrieve rate limits for your plan",
      });
    }

    // 3. Get user's usage in the last 24 hours
    const twentyFourHoursAgo = new Date(
      new Date().getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { count, error: usageError } = await client
      .from("openai_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", twentyFourHoursAgo);

    if (usageError) {
      console.error("Error fetching usage data:", usageError);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not retrieve usage data",
      });
    }

    const dailyLimit = rateLimitSettings.daily_limit;
    const usage = count || 0;
    const remaining = Math.max(0, dailyLimit - usage);

    return {
      dailyLimit,
      usage,
      remaining,
      plan: planType,
    };
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    console.error(`Failed to fetch user limits for ${user.id}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
