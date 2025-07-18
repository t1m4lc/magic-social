import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, getHeader, sendError, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  try {
    const authorization = getHeader(event, "authorization");
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return sendError(
        event,
        createError({
          statusCode: 401,
          statusMessage: "Missing authorization token",
        })
      );
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // Set the session with the provided token
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: "", // We only need to verify the access token
    });

    if (error || !data.user) {
      return sendError(
        event,
        createError({
          statusCode: 401,
          statusMessage: "Invalid or expired token",
        })
      );
    }

    // Get user profile from the database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // Return basic user info even if profile fetch fails
      return {
        id: data.user.id,
        email: data.user.email,
        name:
          data.user.user_metadata?.full_name || data.user.user_metadata?.name,
        avatar: data.user.user_metadata?.avatar_url,
      };
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name:
        profile.full_name ||
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name,
      avatar: profile.avatar_url || data.user.user_metadata?.avatar_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (error) {
    console.error("User info fetch error:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      })
    );
  }
});
