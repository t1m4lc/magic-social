<!-- <script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    // Get redirect path, and clear it from the cookie
    const path = redirectInfo.pluck()
    // Redirect to the saved path, or fallback to dashboard
    return navigateTo(path || '/dashboard') 
  }
}, { immediate: true })
</script> -->

<template>
  <div>Waiting for login...</div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";

const client = useSupabaseClient();

const { data: session } = await useAsyncData("session", async () => {
  const { data } = await client.auth.getSession();
  return data.session;
});

if (session.value?.access_token) {
  const token = session.value.access_token;

  // On redirige vers l'extension avec le token
  const extensionRedirect = `chrome-extension://bihnnpbmbplmblhmidddpepecdgpclgg/callback.html?token=${token}`;
  window.location.href = extensionRedirect;
}
</script>
