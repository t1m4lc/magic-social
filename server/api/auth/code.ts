import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, getQuery, sendError, createError } from "h3";

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string;
  if (!code) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Missing code" })
    );
  }

  const supabase = await serverSupabaseClient(event);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: error.message })
    );
  }

  if (!data.session) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "No session returned" })
    );
  }

  // Renvoie le token à l’extension
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  };
});
