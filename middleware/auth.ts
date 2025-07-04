export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // If user is not authenticated, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }
});
