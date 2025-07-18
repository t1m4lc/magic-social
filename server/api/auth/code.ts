import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, getQuery, sendError, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const code = getQuery(event).code as string;

    if (!code) {
      console.error("Missing authorization code in request");
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "Missing authorization code",
        })
      );
    }

    console.log("Exchanging authorization code for session");

    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Code exchange error:", error);
      return sendError(
        event,
        createError({ statusCode: 400, statusMessage: error.message })
      );
    }

    if (!data.session) {
      console.error("No session returned from code exchange");
      return sendError(
        event,
        createError({ statusCode: 400, statusMessage: "No session returned" })
      );
    }

    console.log("Session created successfully");

    // Return the session data to the extension
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: data.session.user,
    };
  } catch (error) {
    console.error("Unexpected error in code exchange endpoint:", error);
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: "Internal server error" })
    );
  }
});
