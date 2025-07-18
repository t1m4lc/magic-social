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

    return {
      valid: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name:
          data.user.user_metadata?.full_name || data.user.user_metadata?.name,
        avatar: data.user.user_metadata?.avatar_url,
      },
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      })
    );
  }
});
