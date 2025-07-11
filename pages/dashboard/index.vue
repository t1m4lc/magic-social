<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
    <!-- Navigation -->
    <nav class=" bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
              variant="outline"
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
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      <!-- Welcome Section -->
      <Card class="mb-0">
        <CardHeader class="text-center pb-2">
          <CardTitle class="text-3xl font-bold text-gray-900 dark:text-white">Welcome to your Dashboard!</CardTitle>
          <CardDescription class="text-lg text-gray-600 dark:text-gray-300 mt-2">Your AI Social Media Copilot is ready to help</CardDescription>
        </CardHeader>
      </Card>

            <!-- AI Usage Section -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-semibold text-gray-900 dark:text-white">AI Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="usagePending" class="py-4 text-center">
            <LoadingSpinner class="w-6 h-6 mx-auto mb-2" />
            <span class="text-gray-600 dark:text-gray-400">Loading usage...</span>
          </div>
          <div v-else-if="usageError" class="py-4 text-center text-red-600 dark:text-red-400">
            {{ usageError }}
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-2">
            <span class="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none">
              {{ usageCount }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">AI generations in the last 24 hours</span>
            <span v-if="planType" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily limit: {{ dailyLimitMap[planType] }} generations</span>
          </div>
        </CardContent>
      </Card>

      <!-- Plan Section -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-semibold text-gray-900 dark:text-white">Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="planPending" class="py-4 text-center">
            <LoadingSpinner class="w-6 h-6 mx-auto mb-2" />
            <span class="text-gray-600 dark:text-gray-400">Loading plan...</span>
          </div>
          <div v-else-if="planError" class="py-4 text-center text-red-600 dark:text-red-400">
            {{ planError }}
          </div>
          <div v-else class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="text-lg font-medium text-gray-900 dark:text-white">
                {{ planDisplayName(planType) }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ planDescription(planType) }}
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <Button v-if="planType === 'free'" @click="goToPricing" class="w-full md:w-auto mt-2 md:mt-0">
                View Pricing
              </Button>
              <Button v-else
                :disabled="isManagingSubscription"
                @click="manageSubscription"
                class="w-full md:w-auto"
              >
                {{ isManagingSubscription ? 'Redirecting...' : 'Manage Subscription' }}
              </Button>
            </div>
          </div>
          <p v-if="manageSubscriptionError" class="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{{ manageSubscriptionError }}</p>
        </CardContent>
      </Card>

      <!-- User Info Section -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-semibold text-gray-900 dark:text-white">User Information</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>


    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import type { planType } from '~/shared/price.util'
import type { Database } from '~/supabase/supabase'
import { dailyLimitMap } from '~/shared/price.util'


useHead({
  title: 'Dashboard - Magic Social',
  meta: [
    { name: 'description', content: 'Your Magic Social dashboard - AI-powered social media assistance' }
  ]
})

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()

const isSigningOut = ref(false)
const isManagingSubscription = ref(false)
const manageSubscriptionError = ref<string | null>(null)

// Plan state
const planType = ref<planType | null>(null)
const planPending = ref(true)
const planError = ref<string | null>(null)

// Fetch plan info using useFetch (no retry, functional, typed)
const { data: planData, pending: planLoading, error: planFetchError } = await useFetch<{ planType: string }>(
  '/api/user/current-subscription',
  { key: 'current-subscription' }
)

watchEffect(() => {
  planPending.value = planLoading.value
  planError.value = planFetchError.value ? planFetchError.value.message : null
  planType.value = planData.value?.planType === 'pro' || planData.value?.planType === 'ultimate'
    ? (planData.value.planType as 'pro' | 'ultimate')
    : planData.value?.planType === 'free'
      ? 'free'
      : null
})

// Plan display helpers (pure, typed, using record with default value)
const PLAN_DISPLAY_NAMES: Record<planType, string> = {
  free: 'Free Plan',
  pro: 'Pro Plan',
  ultimate: 'Ultimate Plan'
}
const PLAN_DESCRIPTIONS: Record<planType, string> = {
  free: 'Basic features for personal use.',
  pro: 'Advanced features for professionals.',
  ultimate: 'Full features for teams and businesses.'
}
const planDisplayName = (type: planType | null): string =>
  (type && PLAN_DISPLAY_NAMES[type]) || 'Unknown Plan'

const planDescription = (type: planType | null): string =>
  (type && PLAN_DESCRIPTIONS[type]) || 'Plan information unavailable.'

const goToPricing = (): void => {
  navigateTo('/pricing')
}

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

/**
 * Redirects the user to the Stripe customer portal for subscription management.
 * Pure, functional, and immutable: does not mutate user state.
 */
const manageSubscription = async (): Promise<void> => {
  isManagingSubscription.value = true
  manageSubscriptionError.value = null
  try {
    const { portalUrl } = await $fetch<{ portalUrl: string }>('/api/stripe/customer-portal', {
      method: 'POST',
      body: {},
      params: { redirect: '/dashboard' }
    })
    if (portalUrl) {
      window.location.href = portalUrl
    } else {
      manageSubscriptionError.value = 'Unable to get portal URL.'
    }
  } catch (error: unknown) {
    manageSubscriptionError.value =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    console.error('Error redirecting to customer portal:', error)
  } finally {
    isManagingSubscription.value = false
  }
}

// AI usage state
const usageCount = ref(0)
const usagePending = ref(true)
const usageError = ref<string | null>(null)

// Fetch AI usage data
const { data: usageData, pending: usageLoading, error: usageFetchError } = await useFetch<{ count: number }>(
  '/api/ai/usage',
)

watchEffect(() => {
  usagePending.value = usageLoading.value
  usageError.value = usageFetchError.value ? usageFetchError.value.message : null
  usageCount.value = usageData.value?.count ?? 0
})
</script>
