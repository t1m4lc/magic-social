export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  const authForbiddenPath = ["/login"];

  if (user.value && authForbiddenPath.includes(to.path)) {
    return navigateTo("/dashboard");
  }
});
