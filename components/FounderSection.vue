<script setup>
import { AnimatedTooltip } from '~/components/ui/animated-tooltip'
</script>

<template>
  <section class="py-20 px-4 border-t border-border bg-muted/20">
    <div class="container max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div>
          <AnimatedTooltip :items="[
            {
              id: 1,
              name: 'Timothy @t1m4lc',
              designation: 'Maker',
              image: '/me.png'
            }
          ]" :avatar-size="32" />
        </div>

        <div class="text-center md:text-left">
          <h3 class="text-2xl font-bold mb-4 text-black dark:text-white">
            Built by makers, for makers
          </h3>
          <p class="text-lg text-foreground/70 mb-6 leading-relaxed">
            Hey! I'm Timothy, the maker behind Magic Social. I built this because I was tired of spending hours crafting the perfect Twitter replies.
            Now I can focus on building cool stuff instead of overthinking every tweet. Hope it helps you too!
            <span class="saturate-150">🚀</span>
          </p>
          <a href="https://x.com/t1m4lc" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow me on Twitter
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
