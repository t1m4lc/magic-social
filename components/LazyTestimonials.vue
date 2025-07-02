<script setup>
import { Marquee } from '~/components/ui/marquee'

const props = defineProps({
  testimonials: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="bg-muted/30 relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
    <!-- First Marquee -->
    <Marquee :pause-on-hover="true" class="[--duration:25s]">
      <div v-for="tweet in testimonials.slice(0, 4)" :key="tweet.id" class="mx-4">
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
          <!-- Tweet Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <NuxtImg :src="tweet.avatar" :alt="`${tweet.name} avatar`" class="w-12 h-12 rounded-full mr-3" width="48" height="48" loading="lazy" />
              <div>
                <div class="flex items-center space-x-1">
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                  <!-- Verified badge -->
                  <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
              </div>
            </div>
            <!-- Twitter logo -->
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <!-- Tweet Content -->
          <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

          <!-- Tweet Actions -->
          <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
            <div class="flex items-center space-x-6">
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="View comments">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>{{ tweet.comments }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-green-500 transition-colors" aria-label="Retweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{{ tweet.retweets }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-red-500 transition-colors" aria-label="Like tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>{{ tweet.likes }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="Share tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Marquee>

    <!-- Second Marquee (reverse) -->
    <Marquee :reverse="true" :pause-on-hover="true" class="[--duration:25s]">
      <div v-for="tweet in testimonials.slice(4, 8)" :key="tweet.id" class="mx-4">
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
          <!-- Tweet Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <NuxtImg :src="tweet.avatar" :alt="`${tweet.name} avatar`" class="w-12 h-12 rounded-full mr-3" width="48" height="48" loading="lazy" />
              <div>
                <div class="flex items-center space-x-1">
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                  <!-- Verified badge -->
                  <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
              </div>
            </div>
            <!-- Twitter logo -->
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <!-- Tweet Content -->
          <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

          <!-- Tweet Actions -->
          <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
            <div class="flex items-center space-x-6">
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="View comments">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>{{ tweet.comments }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-green-500 transition-colors" aria-label="Retweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{{ tweet.retweets }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-red-500 transition-colors" aria-label="Like tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>{{ tweet.likes }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="Share tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Marquee>

    <!-- Third Marquee -->
    <Marquee :pause-on-hover="true" class="[--duration:30s]">
      <div v-for="tweet in testimonials.slice(8)" :key="tweet.id" class="mx-4">
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
          <!-- Tweet Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <NuxtImg :src="tweet.avatar" :alt="`${tweet.name} avatar`" class="w-12 h-12 rounded-full mr-3" width="48" height="48" loading="lazy" />
              <div>
                <div class="flex items-center space-x-1">
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                  <!-- Verified badge -->
                  <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
              </div>
            </div>
            <!-- Twitter logo -->
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <!-- Tweet Content -->
          <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

          <!-- Tweet Actions -->
          <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
            <div class="flex items-center space-x-6">
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="View comments">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>{{ tweet.comments }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-green-500 transition-colors" aria-label="Retweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{{ tweet.retweets }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-red-500 transition-colors" aria-label="Like tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>{{ tweet.likes }}</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-blue transition-colors" aria-label="Share tweet">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Marquee>

    <!-- Left Gradient -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>

    <!-- Right Gradient -->
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
  </div>
</template>
