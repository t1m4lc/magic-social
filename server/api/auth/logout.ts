import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, getHeader, sendError, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header
    const authorization = getHeader(event, "authorization");
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      // If no token provided, just return success (already logged out)
      return { success: true, message: "Already logged out" };
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // Set the session to sign out the user
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: "", // We only need the access token to sign out
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      // Don't fail completely, just log the error
    }

    return {
      success: true,
      message: "Successfully logged out",
    };
  } catch (error: any) {
    console.error("Logout endpoint error:", error);
    return {
      success: true,
      message: "Logout completed",
    };
  }
});
