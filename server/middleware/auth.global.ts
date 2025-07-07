import { defineEventHandler, createError, getRequestURL } from "h3";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Only apply auth check for API routes
  if (!url.pathname.startsWith("/api")) return;

  // List of public API routes to bypass auth
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/code",
    "/api/stripe/webhook",
    "/api/stripe/create-checkout",
  ];

  const isPublic = publicPaths.some((path) => url.pathname.startsWith(path));
  if (isPublic) return;

  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  event.context.user = user;
});
