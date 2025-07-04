import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/supabase/supabase";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required to access usage data",
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  // Default to last 24 hours
  const fromParam = query.from as string;
  const toParam = query.to as string;
  const from = fromParam ? dayjs(fromParam) : dayjs().subtract(24, "hours");
  const to = toParam ? dayjs(toParam) : dayjs();

  try {
    // Get usage count for the specified period
    const { count, error } = await client
      .from("openai_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch usage data",
      });
    }

    return count || 0;
  } catch (error: any) {
    console.error("Usage API error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch usage statistics",
    });
  }
});
