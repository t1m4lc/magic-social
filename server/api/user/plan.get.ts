import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
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

    const { data: userProfile, error: profileError } = await supabase
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

    return { plan_type: userProfile.plan_type || "free" };
  },
  {
    maxAge: 60 * 60 * 24,
    name: "user-plan",
    getKey: (event) =>
      serverSupabaseUser(event).then((user) => user?.id || "anonymous"),
  }
);
