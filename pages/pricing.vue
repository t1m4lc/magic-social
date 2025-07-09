<script setup lang="ts">
import { ShimmerButton } from '~/components/ui/shimmer-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Check, X, DollarSign, Shield, Lock } from 'lucide-vue-next'
import AuthModal from '~/components/AuthModal.vue'
import GoogleSignInButton from '~/components/GoogleSignInButton.vue'
import { dailyLimitMap, getPlanTypeWithPriceId } from '~/shared/price.util'


// Utility to always provide a valid origin with scheme
const getOrigin = (): string => {
  // Prefer Nuxt's useRequestURL composable
  const { origin } = useRequestURL()
  if (origin && /^https?:\/\//.test(origin)) return origin
  if (process.client && typeof window !== 'undefined') {
    const winOrigin = window.location.origin
    if (/^https?:\/\//.test(winOrigin)) return winOrigin
  }
  // Fallback: use https for production, http for localhost
  if (process.env.NODE_ENV === 'production') {
    return 'https://magic-social.com' // <-- replace with your production domain
  }
  return 'http://localhost:3000'
}

const isLoading = ref(false)
const error = ref<string | null>(null)

// Handle subscription checkout
const handleSubscribe = async (priceId: string): Promise<void> => {
  if (isLoading.value) return
  isLoading.value = true
  error.value = null

  const origin = getOrigin()

  try {
    const response = await $fetch('/api/stripe/checkout-session', {
      method: 'POST',
      body: {
        priceId: priceId,
        successUrl: `${origin}/dashboard?success=true&plan=${getPlanTypeWithPriceId(priceId)}`,
        cancelUrl: `${origin}/pricing?canceled=true`
      }
    })

    console.log("RESPONSE", response);


    // Use navigateTo for client-side navigation
    await navigateTo(response.sessionUrl, { external: true })
  } catch (err: any) {
    console.error('Checkout error:', err)
    error.value = err?.data?.message || err?.message || 'Failed to create checkout session'
  } finally {
    isLoading.value = false
  }
}

// Handle query parameters for success/cancel states
const route = useRoute()
const success = computed<boolean>(() => Boolean(route.query.success))
const canceled = computed<boolean>(() => Boolean(route.query.canceled))
const plan = computed<string | undefined>(() => typeof route.query.plan === 'string' ? route.query.plan : undefined)

useHead({
  title: 'Pricing - Magic Social | AI-powered Twitter Chrome Extension',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { name: 'description', content: 'Simple, transparent pricing for Magic Social. Start free with 5 requests/day, upgrade to Pro for 150 requests/day, or wait for Ultimate with 500 requests/day.' },
    { property: 'og:title', content: 'Pricing - Magic Social | AI-powered Twitter Chrome Extension' },
    { property: 'og:description', content: 'Simple, transparent pricing for Magic Social. Start free, upgrade as you grow.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Pricing - Magic Social' },
    { name: 'twitter:description', content: 'Simple, transparent pricing for Magic Social. Start free, upgrade as you grow.' },
  ]
})


interface Plan {
  id: string
  stripe_price_id: string | null
  name: string
  price: string
  period: string
  description: string
  popular: boolean
  available: boolean
  availableFeatures: string[]
  unavailableFeatures: string[]
  buttonText: string
  buttonVariant: 'default' | 'outline' | 'contact' | string
}

const plans: Plan[] = [
  {
    id: 'ultimate',
    name: 'ULTIMATE',
    stripe_price_id: null,
    price: '€39',
    period: '/mo',
    description: 'Advanced automation and scaling features',
    popular: false,
    available: true,
    availableFeatures: [
      'Everything in Pro',
      `${dailyLimitMap['ultimate']} OpenAI requests per 24h`,
      'Automation',
      'Schedule posts',
      'Auto-like feature',
      'Prioritize support',

    ],
    unavailableFeatures: [],
    buttonText: 'Contact',
    buttonVariant: 'contact',
  },
  {
    id: 'pro',
    name: 'PRO',
    stripe_price_id: String(useRuntimeConfig().public.stripeProPriceId ?? ''),
    price: '€4',
    period: '/mo',
    description: 'For serious Twitter growth and engagement',
    popular: true,
    available: true,
    availableFeatures: [
      'Everything in Free',
      `${dailyLimitMap['pro']} OpenAI requests per 24h`,
      'Custom format instructions',
      'Save & reuse custom prompts',
    ],
    unavailableFeatures: [
      'Automation',
      'Schedule posts',
      'Auto-like feature',
      'Prioritize support',
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default',
  },
  {
    id: 'free',
    name: 'FREE',
    stripe_price_id: null,
    price: '€0',
    period: '/mo',
    description: 'Perfect for testing and getting started',
    popular: false,
    available: true,
    availableFeatures: [
      `${dailyLimitMap['free']} OpenAI requests/24h (for testing)`,
      'Custom tone',
    ],
    unavailableFeatures: [
      'Custom target audience',
      'Custom format instructions',
      'Save & reuse custom prompts',
      'Automation',
      'Schedule posts',
      'Auto-like feature',
      'Prioritize support',
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline',
  },
]


const user = useSupabaseUser()
const showAuthModal = ref(false)

const handleCardClick = (priceId: string | null) => {
  if (!priceId) {
    console.log('Need priceId');
    return
  }

  if (!user.value) {
    showAuthModal.value = true
    return
  }
  const planType = getPlanTypeWithPriceId(priceId)

  if (planType === 'pro') handleSubscribe(priceId)
  else if (planType === 'free') navigateTo(`/dashboard?success=true&plan=${planType}`)
  else if (planType === 'ultimate') navigateTo('mailto:timothyalcaide+magic@gmail.com?subject=Ultimate%20Plan%20Inquiry&body=Hi!%20I%27m%20interested%20in%20the%20Ultimate%20plan%20for%20Magic%20Social.%20Could%20you%20please%20provide%20more%20details%20about%20pricing%20and%20availability%3F', { external: true })
  else throw new Error('No plan type found')
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl saturate-150">✨</span>
          <span class="font-semibold text-lg">Magic Social</span>
        </NuxtLink>
        <nav class="hidden md:flex items-center space-x-6 text-sm">
          <NuxtLink to="/#demo" class="text-foreground/60 hover:text-foreground transition-colors">Demo</NuxtLink>
          <NuxtLink to="/#features" class="text-foreground/60 hover:text-foreground transition-colors">Features</NuxtLink>
          <NuxtLink to="/#testimonials" class="text-foreground/60 hover:text-foreground transition-colors">Reviews</NuxtLink>
          <NuxtLink to="/pricing" class="text-foreground hover:text-foreground transition-colors font-medium">Pricing</NuxtLink>
        </nav>
        <ShimmerButton class="px-4 py-2 text-sm hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color='#ffffff' background='#000000' aria-label="Install Magic Social Chrome Extension">
          Install Extension
        </ShimmerButton>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-12 px-4 bg-muted/5">
      <div class="container max-w-4xl mx-auto text-center">
        <!-- Success message -->
        <div v-if="success" class="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-800">Successfully subscribed to {{ plan }} plan!</p>
        </div>

        <!-- Canceled message -->
        <div v-if="canceled" class="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-yellow-800">Checkout was canceled. You can try again anytime.</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-800">{{ error }}</p>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
          Simple, Transparent Pricing
        </h1>
        <p class="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Start free, upgrade as you grow. No hidden fees, no surprises.
        </p>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="py-20 px-4">
      <div class="container max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card v-for="plan in plans" :key="plan.name" :class="[
            'relative transition-all duration-300',
            plan.popular ? 'border-primary shadow-lg lg:scale-105' : '',
            plan.buttonVariant === 'contact' ? 'opacity-75' : ''
          ]">
            <!-- Popular Badge -->
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader class="text-center pb-4">
              <CardTitle class="text-2xl font-bold">{{ plan.name }}</CardTitle>
              <CardDescription class="text-sm">{{ plan.description }}</CardDescription>
              <div class="pt-4">
                <span class="text-4xl font-bold">{{ plan.price }}</span>
                <span class="text-muted-foreground ml-1">{{ plan.period }}</span>
              </div>
            </CardHeader>
            <CardContent class="flex-1">
              <ul class="space-y-3">
                <li v-for="feature in plan.availableFeatures" :key="`available-${feature}`" class="flex items-start gap-3">
                  <Check class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span class="text-sm text-foreground">{{ feature }}</span>
                </li>
                <li v-for="feature in plan.unavailableFeatures" :key="`unavailable-${feature}`" class="flex items-start gap-3">
                  <X class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span class="text-sm text-muted-foreground">{{ feature }}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button @click="handleCardClick(plan.stripe_price_id)" v-if="plan.buttonVariant === 'default'" variant="default" size="lg" class="w-full">
                {{ plan.buttonText }}
              </Button>
              <Button @click="handleCardClick(plan.stripe_price_id)" v-else-if="plan.buttonVariant === 'outline'" variant="outline" size="lg" class="w-full">
                {{ plan.buttonText }}
              </Button>
              <Button @click="handleCardClick(plan.stripe_price_id)" v-else-if="plan.buttonVariant === 'contact'" variant="default" size="lg" class="w-full">
                {{ plan.buttonText }}
              </Button>
              <Button @click="handleCardClick(plan.stripe_price_id)" v-else variant="secondary" size="lg" class="w-full">
                {{ plan.buttonText }}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>

    <!-- Trust Signals & Guarantees -->
    <section class="py-16 px-4 bg-background">
      <div class="container max-w-6xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <!-- 7-Day Money Back -->
          <div class="flex flex-col items-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <DollarSign class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold mb-2">7-Day Money Back</h3>
            <p class="text-sm text-muted-foreground">Not satisfied? Get a full refund within 7 days, no questions asked.</p>
          </div>

          <!-- Cancel Anytime -->
          <div class="flex flex-col items-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Lock class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Cancel Anytime</h3>
            <p class="text-sm text-muted-foreground">No long-term contracts. Cancel your subscription anytime with one click.</p>
          </div>

          <!-- Secure & Private -->
          <div class="flex flex-col items-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Shield class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Secure & Private</h3>
            <p class="text-sm text-muted-foreground">Bank-grade encryption. Your data is protected and never shared with third parties.</p>
          </div>
        </div>

        <!-- Additional Trust Elements -->
        <div class="mt-12 text-center">
          <div class="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-muted-foreground" />
              <span>SSL Encrypted</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-muted-foreground" />
              <span>GDPR Compliant</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-muted-foreground" />
              <span>Stripe Secured</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-muted-foreground" />
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-muted/20">
      <div class="container max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to supercharge your Twitter game?</h2>
        <p class="text-lg md:text-xl text-foreground/70 mb-8">
          Start free today and experience the magic of AI-powered Twitter engagement.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ShimmerButton class="px-4 py-2 text-sm hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color='#ffffff' background='#000000' aria-label="Install Magic Social Chrome Extension">
            ✨ Install Chrome Extension
          </ShimmerButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border py-16 px-4">
      <div class="container max-w-6xl mx-auto">
        <div class="flex items-center justify-center space-x-2 mb-8">
          <span class="text-xl saturate-150">✨</span>
          <span class="font-semibold text-lg">Magic Social</span>
        </div>

        <!-- Footer Links -->
        <div class="flex justify-center space-x-8 mb-8">
          <NuxtLink to="/pricing" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Pricing
          </NuxtLink>
          <NuxtLink to="/terms" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Terms
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Privacy
          </NuxtLink>
          <a href="mailto:timothyalcaide+magic@gmail.com" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        <div class="text-center">
          <p class="text-sm text-foreground/50">© {{ new Date().getFullYear() }} Magic Social. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Auth Modal -->
    <AuthModal :open="showAuthModal" @close="showAuthModal = false">
      <div class="flex flex-col gap-4">
        <Button variant="default" size="lg" class="w-full" @click="navigateTo('/auth/confirm')">
          Continue with Email
        </Button>
        <GoogleSignInButton class="w-full" />
      </div>
    </AuthModal>
  </div>
</template>