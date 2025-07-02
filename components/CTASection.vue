<script setup>
import { ShimmerButton } from '~/components/ui/shimmer-button'
import BlackHoleBackground from '~/components/ui/bg-black-hole/BlackHoleBackground.vue'
</script>

<template>
  <section class="relative h-96 w-full">
    <BlackHoleBackground class="absolute inset-0 flex items-center justify-center rounded-xl" />
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <!-- This empty div ensures stacking context for overlay -->
    </div>
    <section class="absolute inset-0 flex items-center justify-center z-10">
      <div class="container max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Do you want to be a magician? ✨</h2>
        <p class="text-lg md:text-xl text-foreground/70 mb-8">
          Magic reply it's like magic, transforming your Twitter drafts instantly.
        </p>
        <div class="flex justify-center">
          <ShimmerButton class="px-8 py-4 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000" aria-label="Become a Twitter Magician with Magic Social">
            ✨ Become a Twitter Magician
          </ShimmerButton>
        </div>
      </div>
    </section>
  </section>
</template>
