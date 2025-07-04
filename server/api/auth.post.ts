import {
  serverSupabaseClient,
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from "#supabase/server";
import {
  defineEventHandler,
  createError,
  sendError,
  getQuery,
  getRequestURL,
} from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  // Get the redirect URL from query params or use default
  const query = getQuery(event);
  const redirectTo =
    (query.redirectTo as string) ||
    `${getRequestURL(event).origin}/auth/callback`;

  // Sign in with Google OAuth
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
