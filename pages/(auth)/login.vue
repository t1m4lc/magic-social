<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-8">
      <!-- Header -->
      <div class="text-center space-y-4">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <span class="text-xl saturate-150">✨</span>
          <h1 class="font-semibold text-2xl text-gray-900 dark:text-white">Magic Social</h1>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Your AI Social Media Copilot
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <!-- Welcome Section -->
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome!
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Sign in to unlock AI-powered social media assistance
          </p>
        </div>

        <!-- Error Message -->
        <div 
          v-if="error" 
          class="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Google Sign In Button -->
        <GoogleSignInButton 
          :loading="isLoading"
          @click="signInWithGoogle"
        />

        <!-- Features List -->
        <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            What you'll get:
          </p>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <span class="text-lg">✨</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                AI-powered tweet and reply generation
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-lg">🎯</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Contextual social media assistance
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-lg">📝</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Custom prompts and tone settings
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-lg">⚡</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                One-click social engagement
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'Sign in - Magic Social | Your AI Social Media Copilot',
  meta: [
    { name: 'description', content: 'Sign in to Magic Social and unlock AI-powered social media assistance with tweet generation, contextual help, and one-click engagement.' }
  ]
})

const isLoading = ref(false)
const error = ref<string | null>(null)

const user = useSupabaseUser()

// Redirect if already logged in
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

const signInWithGoogle = async (): Promise<void> => {
  isLoading.value = true
  error.value = null

  try {
    const res = await $fetch<{ url: string }>('/api/auth/login', { method: 'POST' })
    if (res?.url) {
      await navigateTo(res.url, { external: true })
    } else {
      error.value = 'Failed to get authentication URL'
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to sign in with Google'
  } finally {
    isLoading.value = false
  }
}
</script>
