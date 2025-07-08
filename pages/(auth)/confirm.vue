<template>
  <div>Connexion en cours...</div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { useSendTokenToExtension } from '~/composables/extensionNotifications'
import type { Database } from "~/supabase/supabase";

const client = useSupabaseClient<Database>();
const { sendToken } = useSendTokenToExtension();

const { data: session } = await useAsyncData("session", async () => {
  const { data } = await client.auth.getSession();
  return data.session;
});

const isFromExtension = (): boolean => {
  if (typeof window === 'undefined') return false;
  const url = new URL(window.location.href);
  return url.searchParams.get('from') === 'extension';
};

const handleWebApp = async () => {
  await sendToken();
  // Check for redirect param
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect') || '/dashboard'
    if (redirect) {
      await navigateTo(redirect);
      return;
    }
  }
  await navigateTo('/dashboard');
};

const handleExtension = (token: string) => {
  // Redirige vers l'extension avec le token
  const extensionRedirect = `chrome-extension://bihnnpbmbplmblhmidddpepecdgpclgg/callback.html?token=${token}`;
  window.location.href = extensionRedirect;
};

if (session.value?.access_token) {
  if (isFromExtension()) {
    console.log("FROM EXTENSION");
    
    handleExtension(session.value.access_token);
  } else {
    await handleWebApp();
  }
}
</script>
