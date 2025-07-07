import { serverSupabaseClient } from "#supabase/server";
import { getQuery, defineEventHandler, sendError, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const redirectTo = getQuery(event).redirect as string;

  if (
    !redirectTo ||
    (!redirectTo.startsWith("chrome-extension://") &&
      !redirectTo.startsWith("https://") &&
      !redirectTo.includes(".chromiumapp.org"))
  ) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid or missing redirect URI",
      })
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error || !data.url) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error?.message || "OAuth initiation failed",
      })
    );
  }

  return {
    url: data.url,
    provider: "google",
  };
});
