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
        <Button type="button" variant="default" size="lg" class="w-full" :disabled="submitting" @click="signInWithGoogle">
          <span v-if="submitting">Signing in...</span>
          <span v-else>Sign in with Google</span>
        </Button>
        <div v-if="error" class="mt-3 text-red-600 text-sm text-center">{{ errorMsg }}</div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

import { ref } from 'vue'

const submitting = ref(false)
const error = ref(false)
const errorMsg = ref('')

const supabase = useSupabaseClient()

const signInWithGoogle = async (): Promise<void> => {
  submitting.value = true
  error.value = false
  errorMsg.value = ''
  try {
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/confirm'
      }
    })
    if (signInError) {
      error.value = true
      errorMsg.value = signInError.message
    }
  } catch (e: any) {
    error.value = true
    errorMsg.value = e?.message || 'An unknown error occurred.'
  } finally {
    submitting.value = false
  }
}
</script>
