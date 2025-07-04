import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, sendRedirect, getQuery, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const next = query.next || "/";

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing authorization code",
    });
  }

  const supabase = await serverSupabaseClient<Database>(event);

  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  // Redirect to the next page or home
  return sendRedirect(event, next as string);
});
