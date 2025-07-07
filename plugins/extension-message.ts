export default defineNuxtPlugin(() => {
  if (typeof window === "undefined") return;

  const handler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    if (
      event.data?.type === "SUPABASE_LOGOUT" ||
      event.data?.type === "SUPABASE_LOGIN"
    ) {
      window.location.reload();
    }
  };

  window.addEventListener("message", handler);

  window.addEventListener("beforeunload", () => {
    window.removeEventListener("message", handler);
  });
});
