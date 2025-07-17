<script setup>
import ShimmerButton from '~/components/ui/shimmer-button/ShimmerButton.vue';

function onExtensionInstall() {
 navigateTo(URLS.CHROME_WEBSTORE, {
  external: true,
  open: { target: '_blank' }
 });
}
</script>

<template>
 <div class="min-h-screen bg-background text-foreground">
  <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
   <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
    <div class="flex items-center space-x-2">
     <span class="text-xl saturate-150">✨</span>
     <span class="font-semibold text-lg">Magic Social</span>
    </div>
    <nav class="hidden md:flex items-center space-x-6 text-sm">
     <NuxtLink to="/#demo" class="text-foreground/60 hover:text-foreground transition-colors">Demo</NuxtLink>
     <NuxtLink to="/#features" class="text-foreground/60 hover:text-foreground transition-colors">Features</NuxtLink>
     <NuxtLink to="/#testimonials" class="text-foreground/60 hover:text-foreground transition-colors">Reviews</NuxtLink>
     <NuxtLink to="/pricing" class="text-foreground hover:text-foreground transition-colors font-medium">Pricing</NuxtLink>
    </nav>
    <ShimmerButton @click="onExtensionInstall()" class="px-4 py-2 text-sm hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000" aria-label="Install Magic Social Chrome Extension">
     Install Extension
    </ShimmerButton>
   </div>
  </header>

  <slot />

  <footer class="border-t border-border py-16 px-4">
   <div class="container max-w-6xl mx-auto">
    <div class="flex items-center justify-center space-x-2 mb-8">
     <span class="text-xl saturate-150">✨</span>
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
     <a href="https://insigh.to/b/magic-social" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
      Feedbacks
     </a>
     <a href="mailto:timothyalcaide+magic@gmail.com" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
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
