<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Sign in to continue</DialogTitle>
        <DialogDescription>
            Authentication is required to continue. Please sign in with Google to proceed.
        </DialogDescription>
      </DialogHeader>
      <div class="mt-6 flex flex-col gap-3">
        <GoogleSignInButton :loading="submitting" @click="signInWithGoogle" />
        <div v-if="error" class="mt-3 text-red-600 text-sm text-center">{{ errorMsg }}</div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import GoogleSignInButton from '~/components/GoogleSignInButton.vue'
import { useSendTokenToExtension } from '~/composables/extensionNotifications'

defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

import { ref } from 'vue'
import type { Database } from '~/supabase/supabase';

const submitting = ref(false)
const error = ref(false)
const errorMsg = ref('')

const supabase = useSupabaseClient<Database>()
const { sendToken } = useSendTokenToExtension()

const signInWithGoogle = async (): Promise<void> => {
  submitting.value = true
  error.value = false
  errorMsg.value = ''

  const route = useRoute()
  const redirect: string = route.fullPath
  
  const origin = window.location.origin
  const redirectUrl = `${origin}/confirm?redirect=${redirect}`
  
  try {
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (signInError) {
      console.error('Supabase OAuth error:', signInError)
      error.value = true
      errorMsg.value = `OAuth error: ${signInError.message}. Please check your Supabase configuration.`
    } else {
      await sendToken()
    }
  } catch (e: any) {
    console.error('OAuth exception:', e)
    error.value = true
    errorMsg.value = e?.message || 'An unknown error occurred.'
  } finally {
    submitting.value = false
  }
}

</script>
