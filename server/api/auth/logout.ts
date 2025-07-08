import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, sendError, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  try {
    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to log out",
      });
    }

    return {
      success: true,
      message: "Successfully logged out",
    };
  } catch (error: any) {
    return sendError(event, error);
  }
});
