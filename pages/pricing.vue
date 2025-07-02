<script setup>
import { ShimmerButton } from '~/components/ui/shimmer-button'
import { RainbowButton } from '~/components/ui/rainbow-button'

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

// Shared styles and properties
const buttonTransition = "hover:scale-105 active:scale-95 transition-transform duration-200"
const navLinkClasses = "text-foreground/60 hover:text-foreground transition-colors"
const cardClasses = "border border-border rounded-xl p-6"
const faqHeadingClasses = "text-lg font-semibold mb-3"
const primaryButtonProps = {
  'shimmer-color': '#ffffff',
  background: '#000000'
}
const installExtensionLabel = 'Install Magic Social Chrome Extension'

const plans = [
  {
    name: 'FREE',
    price: '€0',
    period: '/mo',
    description: 'Perfect for testing and getting started',
    popular: false,
    available: true,
    features: [
      'Custom tone',
      'Custom target audience', 
      '5 requests/day (for testing)'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'secondary'
  },
  {
    name: 'PRO',
    price: '€5',
    period: '/mo',
    description: 'For serious Twitter growth and engagement',
    popular: true,
    available: true,
    features: [
      'Everything in Free',
      '150 OpenAI requests/day',
      'Custom format instructions',
      'Save & reuse custom prompts'
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'primary'
  },
  {
    name: 'ULTIMATE',
    price: '€25',
    period: '/mo',
    description: 'Advanced automation and scaling features',
    popular: false,
    available: false,
    comingSoon: true,
    features: [
      'Everything in Pro',
      '500 OpenAI requests/day',
      'Automation',
      'Schedule posts',
      'Auto-like feature'
    ],
    buttonText: 'Coming Soon',
    buttonVariant: 'disabled'
  }
]
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
          <NuxtLink to="/#demo" :class="navLinkClasses">Demo</NuxtLink>
          <NuxtLink to="/#features" :class="navLinkClasses">Features</NuxtLink>
          <NuxtLink to="/#testimonials" :class="navLinkClasses">Reviews</NuxtLink>
          <NuxtLink to="/pricing" class="text-foreground hover:text-foreground transition-colors font-medium">Pricing</NuxtLink>
        </nav>
        <ShimmerButton 
          :class="`px-4 py-2 text-sm ${buttonTransition}`" 
          v-bind="primaryButtonProps" 
          :aria-label="installExtensionLabel"
        >
          Install Extension
        </ShimmerButton>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-12 px-4 bg-muted/5">
      <div class="container max-w-4xl mx-auto text-center">
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
          <div v-for="plan in plans" :key="plan.name" 
               :class="[
                 'border rounded-xl p-8 text-center relative transition-all duration-300',
                 plan.popular ? 'border-2 border-blue-500 scale-105 shadow-xl' : 'border-border hover:shadow-lg',
                 plan.comingSoon ? 'opacity-75' : ''
               ]">
            
            <!-- Popular Badge -->
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>

            <!-- Coming Soon Badge -->
            <div v-if="plan.comingSoon" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Coming Soon
            </div>
            
            <!-- Plan Header -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
              <p class="text-foreground/60 text-sm mb-4">{{ plan.description }}</p>
            </div>
            
            <!-- Pricing -->
            <div class="mb-8">
              <div class="text-4xl font-bold mb-2">
                {{ plan.price }}<span class="text-lg font-normal text-foreground/60">{{ plan.period }}</span>
              </div>
            </div>
            
            <!-- Features -->
            <ul class="space-y-3 mb-8 text-left">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start text-sm">
                <span class="text-green-500 mr-3 flex-shrink-0 mt-0.5">✅</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
            <!-- CTA Button -->
            <div class="mt-auto">
              <RainbowButton 
                v-if="plan.buttonVariant === 'primary'"
                :class="`w-full py-3 text-sm font-semibold ${buttonTransition}`"
                v-bind="primaryButtonProps"
                :aria-label="`${plan.buttonText} - ${plan.name} plan`"
              >
                {{ plan.buttonText }}
              </RainbowButton>
              
              <ShimmerButton 
                v-else-if="plan.buttonVariant === 'secondary'"
                :class="`w-full py-3 text-sm font-semibold ${buttonTransition}`"
                shimmer-color="#6B7280" 
                background="#6B7280"
                :aria-label="`${plan.buttonText} - ${plan.name} plan`"
              >
                {{ plan.buttonText }}
              </ShimmerButton>

              <button 
                v-else
                class="w-full py-3 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                disabled
                :aria-label="`${plan.buttonText} - ${plan.name} plan`"
              >
                {{ plan.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 bg-muted/10">
      <div class="container max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-lg text-foreground/60">Everything you need to know about our pricing</p>
        </div>
        
        <div class="grid gap-8">
          <div :class="cardClasses">
            <h3 :class="faqHeadingClasses">Can I upgrade or downgrade my plan anytime?</h3>
            <p class="text-foreground/70">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          
          <div :class="cardClasses">
            <h3 :class="faqHeadingClasses">What happens when I reach my daily request limit?</h3>
            <p class="text-foreground/70">Once you reach your daily limit, you'll need to wait until the next day or upgrade to a higher plan for more requests.</p>
          </div>
          
          <div :class="cardClasses">
            <h3 :class="faqHeadingClasses">When will the Ultimate plan be available?</h3>
            <p class="text-foreground/70">The Ultimate plan with advanced automation features is coming soon. Join our waitlist to be notified when it launches.</p>
          </div>
          
          <div :class="cardClasses">
            <h3 :class="faqHeadingClasses">Do you offer refunds?</h3>
            <p class="text-foreground/70">We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.</p>
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
          <RainbowButton 
            :class="`px-8 py-4 text-lg font-semibold ${buttonTransition}`" 
            v-bind="primaryButtonProps" 
            :aria-label="installExtensionLabel"
          >
            ✨ Install Chrome Extension
          </RainbowButton>
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
          <NuxtLink to="/pricing" :class="`text-sm ${navLinkClasses}`">
            Pricing
          </NuxtLink>
          <NuxtLink to="/terms" :class="`text-sm ${navLinkClasses}`">
            Terms
          </NuxtLink>
          <NuxtLink to="/privacy" :class="`text-sm ${navLinkClasses}`">
            Privacy
          </NuxtLink>
          <a href="mailto:timothyalcaide+magic@gmail.com" :class="`text-sm ${navLinkClasses}`">
            Contact
          </a>
        </div>

        <div class="text-center">
          <p class="text-sm text-foreground/50">© {{ new Date().getFullYear() }} Magic Social. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
