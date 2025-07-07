<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center space-x-2">
              <span class="text-xl saturate-150">✨</span>
              <h1 class="font-semibold text-xl text-gray-900 dark:text-white">Magic Social</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <Button
              @click="signOut"
              :disabled="isSigningOut"
            >
              {{ isSigningOut ? 'Signing out...' : 'Sign Out' }}
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <div class="text-center space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to your Dashboard!
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Your AI Social Media Copilot is ready to help
          </p>
        </div>
      </div>

      <!-- User Info Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          User Information
        </h3>
        
        <div v-if="user" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- User Avatar & Basic Info -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <img
                  v-if="user.user_metadata?.avatar_url"
                  :src="user.user_metadata.avatar_url"
                  :alt="user.user_metadata?.full_name || 'User Avatar'"
                  class="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
                <div v-else class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white font-semibold text-xl">
                    {{ (user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ user.user_metadata?.full_name || 'User' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ user.email }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Account Details -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  {{ user.id }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Verified</label>
                <p class="mt-1 text-sm">
                  <span :class="user.email_confirmed_at ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ user.email_confirmed_at ? '✓ Verified' : '✗ Not Verified' }}
                  </span>
                </p>
              </div>
              <div v-if="user.last_sign_in_at">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Sign In</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ formatDate(user.last_sign_in_at) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ formatDate(user.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Provider Info -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h5 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Authentication Provider</h5>
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Google</span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <LoadingSpinner class="w-8 h-8 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">Loading user information...</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <span class="text-3xl mb-4 block">✨</span>
            <h4 class="font-medium text-gray-900 dark:text-white">AI Tweet Generator</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
          </div>
          <div class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <span class="text-3xl mb-4 block">🎯</span>
            <h4 class="font-medium text-gray-900 dark:text-white">Smart Replies</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
          </div>
          <div class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <span class="text-3xl mb-4 block">📊</span>
            <h4 class="font-medium text-gray-900 dark:text-white">Analytics</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import type { Database } from '~/supabase/supabase'


useHead({
  title: 'Dashboard - Magic Social',
  meta: [
    { name: 'description', content: 'Your Magic Social dashboard - AI-powered social media assistance' }
  ]
})

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()

const isSigningOut = ref(false)

// Use dayjs composable for date formatting
const dayjs = useDayjs()

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  try {
    return dayjs(dateString).format('MMMM D, YYYY h:mm A')
  } catch {
    return 'Invalid date'
  }
}

const signOut = async (): Promise<void> => {
  try {
    isSigningOut.value = true
    await supabase.auth.signOut()
    await navigateTo('/')
    notifyExtensionLogout();
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    isSigningOut.value = false
  }
}
</script>
