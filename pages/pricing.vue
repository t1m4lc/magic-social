<script setup>
import { ShimmerButton } from '~/components/ui/shimmer-button'

useHead({
  title: 'Pricing - Magic Social',
  meta: [
    { name: 'description', content: 'Simple, transparent pricing for Magic Social. Start free, upgrade as you grow.' },
  ]
})

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '€0',
    period: '/month',
    popular: false,
    features: [
      'Basic reply prompts',
      '50 AI generations/month', 
      'Chrome extension access'
    ],
    buttonText: 'Get Started Free'
  },
  {
    name: 'Pro',
    description: 'For serious Twitter growth',
    price: '€9',
    period: '/month',
    popular: true,
    features: [
      'Unlimited AI generations',
      'Custom prompt creation',
      'Engagement analytics',
      'Priority support'
    ],
    buttonText: 'Upgrade to Pro'
  }
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl">✨</span>
          <span class="font-semibold text-lg">Magic Social</span>
        </NuxtLink>
        <nav class="hidden md:flex items-center space-x-6 text-sm">
          <NuxtLink to="/#features" class="text-foreground/60 hover:text-foreground transition-colors">Features</NuxtLink>
          <NuxtLink to="/#testimonials" class="text-foreground/60 hover:text-foreground transition-colors">Reviews</NuxtLink>
          <NuxtLink to="/#faq" class="text-foreground/60 hover:text-foreground transition-colors">FAQ</NuxtLink>
          <NuxtLink to="/pricing" class="text-foreground hover:text-foreground transition-colors font-medium">Pricing</NuxtLink>
        </nav>
        <ShimmerButton 
          class="px-4 py-2 text-sm"
          shimmer-color="#3B82F6"
          background="#3B82F6"
        >
          Install Extension
        </ShimmerButton>
      </div>
    </header>

    <section class="pt-32 pb-20 px-4">
      <div class="container max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Simple, Transparent Pricing
        </h1>
        <p class="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
          Choose the plan that fits your needs. Start free, upgrade as you grow.
        </p>
      </div>
    </section>

    <section class="pb-20 px-4">
      <div class="container max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div v-for="plan in plans" :key="plan.name" 
               :class="[
                 'border rounded-xl p-8 text-center relative',
                 plan.popular ? 'border-2 border-blue-500' : 'border-border'
               ]">
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-foreground/60 mb-6">{{ plan.description }}</p>
            
            <div class="text-4xl font-bold mb-6">
              {{ plan.price }}<span class="text-lg font-normal text-foreground/60">{{ plan.period }}</span>
            </div>
            
            <ul class="space-y-3 mb-8 text-left">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center text-sm">
                <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ feature }}
              </li>
            </ul>
            
            <ShimmerButton 
              class="w-full py-3"
              :shimmer-color="plan.popular ? '#3B82F6' : '#6B7280'"
              :background="plan.popular ? '#3B82F6' : '#6B7280'"
            >
              {{ plan.buttonText }}
            </ShimmerButton>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-border py-16 px-4">
      <div class="container max-w-6xl mx-auto text-center">
        <div class="flex items-center justify-center space-x-2 mb-8">
          <span class="text-xl">✨</span>
          <span class="font-semibold text-lg">Magic Social</span>
        </div>
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
        </div>
        <div class="text-center">
          <p class="text-sm text-foreground/50">© 2025 Magic Social. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
