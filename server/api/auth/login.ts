import { serverSupabaseClient } from "#supabase/server";
import { getQuery, defineEventHandler, sendError, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);

    const redirectTo = getQuery(event).redirect as string;

    if (!redirectTo) {
      console.error("Missing redirect URI in login request");
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "Invalid or missing redirect URI",
        })
      );
    }

    console.log("Initiating OAuth flow with redirect:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("OAuth initiation error:", error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: error.message || "OAuth initiation failed",
        })
      );
    }

    if (!data.url) {
      console.error("No OAuth URL returned from Supabase");
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: "No OAuth URL returned from Supabase",
        })
      );
    }

    console.log("OAuth URL generated successfully");

    return {
      url: data.url,
      provider: "google",
    };
  } catch (error) {
    console.error("Unexpected error in login endpoint:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      })
    );
  }
});
