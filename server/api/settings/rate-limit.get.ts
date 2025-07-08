import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/supabase/supabase";

export default defineCachedEventHandler(
  async (event) => {
    const { plan_type = "free" } = getQuery(event);

    const supabase = await serverSupabaseClient<Database>(event);

    const { data: rateLimitSettings, error: rateLimitError } = await supabase
      .from("rate_limit_settings")
      .select("daily_limit")
      .eq("plan_type", plan_type as string)
      .single();

    if (rateLimitError || !rateLimitSettings) {
      console.error("Error fetching rate limits:", rateLimitError);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not retrieve rate limits",
      });
    }

    return rateLimitSettings;
  },
  {
    maxAge: 60 * 60 * 24,
    name: "rate-limit-settings",
    getKey: (event) => {
      const { plan_type = "free" } = getQuery(event);
      return plan_type as string;
    },
  }
);
