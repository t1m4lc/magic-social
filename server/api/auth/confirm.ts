import { serverSupabaseClient } from "#supabase/server";
import { defineEventHandler, getQuery, sendRedirect, createError } from "h3";
import { Database } from "~/supabase/supabase";

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  if (!code || typeof code !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid OAuth code",
    });
  }

  const supabase = await serverSupabaseClient<Database>(event);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw createError({
      statusCode: 401,
      statusMessage: error.message || "OAuth confirmation failed",
    });
  }

  return sendRedirect(event, "/dashboard");
});
