import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, createError, sendError, getRequestURL } from "h3";
import type { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  // Always redirect to /confirm page
  const redirectTo = `${getRequestURL(event).origin}/confirm`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: error.message,
      })
    );
  }

  // Return the OAuth URL for the client to redirect to
  return {
    url: data.url,
    provider: "google",
  };
});
