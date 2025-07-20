<script setup>
import RainbowButton from '~/components/ui/rainbow-button/RainbowButton.vue'
import AuroraBackground from '~/components/ui/aurora-background/AuroraBackground.vue'
import MediaLoader from '~/components/MediaLoader.vue'
import { URLS } from '~/shared/constants';

// Lazy load components for better performance
const TestimonialsSection = defineAsyncComponent(() => import('~/components/TestimonialsSection.vue'))
const FeaturesSection = defineAsyncComponent(() => import('~/components/FeaturesSection.vue'))
const FAQSection = defineAsyncComponent(() => import('~/components/FAQSection.vue'))
const CTASection = defineAsyncComponent(() => import('~/components/CTASection.vue'))
const FounderSection = defineAsyncComponent(() => import('~/components/FounderSection.vue'))



definePageMeta({
  layout: 'landing',
})

// SEO
useHead({
  title: 'Magic Social - AI-powered Social Media Chrome Extension',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { name: 'description', content: 'Turn 10 minutes of work into 10× Twitter engagement. AI-powered copilot for crafting, replying & growing your Twitter presence.' },
    { property: 'og:title', content: 'Magic Social - AI-powered Twitter Chrome Extension' },
    { property: 'og:description', content: 'Turn 10 minutes of work into 10× Twitter engagement without leaving your browser.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Magic Social - AI-powered Twitter Chrome Extension' },
    { name: 'twitter:description', content: 'Turn 10 minutes of work into 10× Twitter engagement without leaving your browser.' },
  ]
})

function onExtensionInstall() {
 navigateTo(URLS.CHROME_WEBSTORE, {
  external: true,
  open: { target: '_blank' }
 });
}

// Social proof data for animated tooltip
const socialProof = [
  {
    id: 3,
    name: "Alex Chen",
    designation: "Creator",
    image: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: 4,
    name: "Maria Santos",
    designation: "Entrepreneur",
    image: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 5,
    name: "Jake Rodriguez",
    designation: "Product Designer",
    image: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 6,
    name: "Emma Wilson",
    designation: "Tech Founder",
    image: "https://i.pravatar.cc/150?img=6"
  },
  {
    id: 7,
    name: "David Kim",
    designation: "Full Stack Dev",
    image: "https://i.pravatar.cc/150?img=7"
  },
  {
    id: 8,
    name: "Nina Patel",
    designation: "Startup Builder",
    image: "https://i.pravatar.cc/150?img=8"
  }
]

// Tweet-style testimonials for marquee
const tweetTestimonials = [
  {
    id: 1,
    name: "Sarah",
    handle: "@NeverCodeAlone",
    avatar: "https://i.pravatar.cc/150?img=11",
    content: "Magic Social has doubled our engagement in under 2 weeks. Zero learning curve! 🚀",
    timestamp: "2h",
    comments: 12,
    retweets: 28,
    likes: 156
  },
  {
    id: 2,
    name: "DevGuru",
    handle: "@dev_guru_os",
    avatar: "https://i.pravatar.cc/150?img=12",
    content: "Finally, an extension that _just works_ on Twitter. No more struggling with copy! ✨",
    timestamp: "4h",
    comments: 8,
    retweets: 15,
    likes: 89
  },
  {
    id: 3,
    name: "Alex Chen",
    handle: "@alexbuilds",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Been using Magic Social for a month. My replies are getting 3x more likes 📈",
    timestamp: "6h",
    comments: 24,
    retweets: 41,
    likes: 203
  },
  {
    id: 4,
    name: "Maria Santos",
    handle: "@maria_creates",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "This is what I've been waiting for! My Twitter game just leveled up 💫",
    timestamp: "1d",
    comments: 6,
    retweets: 19,
    likes: 67
  },
  {
    id: 5,
    name: "Tim Builder",
    handle: "@timbuilds",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Magic Social = more time building, less time crafting tweets. Perfect! 🛠️",
    timestamp: "2d",
    comments: 18,
    retweets: 32,
    likes: 142
  },
  {
    id: 6,
    name: "Emma Wilson",
    handle: "@emma_codes",
    avatar: "https://i.pravatar.cc/150?img=6",
    content: "Just got my first viral reply using Magic Social! The AI suggestions are spot-on 🎯",
    timestamp: "3h",
    comments: 35,
    retweets: 67,
    likes: 289
  },
  {
    id: 7,
    name: "David Kim",
    handle: "@davidbuilds",
    avatar: "https://i.pravatar.cc/150?img=7",
    content: "As a busy founder, Magic Social saves me hours every week. Game changer! 💪",
    timestamp: "5h",
    comments: 14,
    retweets: 23,
    likes: 98
  },
  {
    id: 8,
    name: "Nina Patel",
    handle: "@nina_startups",
    avatar: "https://i.pravatar.cc/150?img=8",
    content: "Magic Social helped me go from 500 to 5K followers in 3 months. Incredible! 🚀",
    timestamp: "8h",
    comments: 42,
    retweets: 89,
    likes: 376
  },
  {
    id: 9,
    name: "Jake Rodriguez",
    handle: "@jake_designs",
    avatar: "https://i.pravatar.cc/150?img=9",
    content: "The tone customization is perfect. My replies finally sound like me, but better! ✨",
    timestamp: "12h",
    comments: 9,
    retweets: 16,
    likes: 74
  },
  {
    id: 10,
    name: "Sophie Miller",
    handle: "@sophie_tech",
    avatar: "https://i.pravatar.cc/150?img=10",
    content: "Used to spend 30 mins crafting each reply. Now it's 30 seconds. Magic! 🪄",
    timestamp: "1d",
    comments: 21,
    retweets: 38,
    likes: 167
  },
  {
    id: 11,
    name: "Ryan Torres",
    handle: "@ryan_creates",
    avatar: "https://i.pravatar.cc/150?img=13",
    content: "Magic Social understands context better than I do sometimes 😂 Love it!",
    timestamp: "1d",
    comments: 16,
    retweets: 25,
    likes: 112
  },
  {
    id: 12,
    name: "Lily Chang",
    handle: "@lily_makes",
    avatar: "https://i.pravatar.cc/150?img=14",
    content: "Finally, an AI tool that doesn't make me sound like a robot. Authentic & engaging! 🤖➡️😊",
    timestamp: "2d",
    comments: 11,
    retweets: 20,
    likes: 87
  }
]

</script>

<template>
  <!-- Hero Section -->
  <section>
    <AuroraBackground>
      <div class="py-20 px-4">
        <div class="container max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Turn 10 minutes into 10× Twitter engagement
          </h1>
          <p class="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered Chrome extension that helps you craft better tweets, replies, and grow your presence smarter.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <RainbowButton class="px-8 py-4 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000" aria-label="Install Magic Social Chrome Extension" @click="onExtensionInstall">
              ✨ Install Chrome Extension
            </RainbowButton>
          </div>

          <!-- Social Proof -->
          <div class="flex justify-center items-center flex-col gap-2 text-sm text-foreground/60">
            <div class="flex items-center gap-2">
              <AnimatedTooltip :items="socialProof" />
            </div>
            <span>Used by smart people</span>
          </div>
        </div>
      </div>
    </AuroraBackground>
  </section>

  <!-- Product Video Section -->
  <section id="demo" class="py-20 px-4 bg-muted/5">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">See Magic Social in Action</h2>
        <p class="text-lg text-foreground/60 max-w-2xl mx-auto">
          Watch how our AI-powered extension transforms your Twitter experience in real-time.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="relative rounded-2xl overflow-hidden border shadow-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div class="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <MediaLoader src="/showcase.gif" media-type="gif" :duration="2000" :min-duration="1000" title="Loading demo..." subtitle="Getting ready to show you Magic Social in action">
              <template #default="{ loading, progress }">
                <img src="/showcase.gif" alt="Magic Social Chrome Extension Demo - AI-powered Twitter engagement in action" class="w-full h-full object-cover rounded-lg transition-all duration-700 ease-out" :class="{ 'opacity-0 blur-sm scale-105': loading, 'opacity-100 blur-0 scale-100': !loading }" loading="lazy" />
              </template>
            </MediaLoader>
          </div>

          <!-- Video overlay with play button aesthetic -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Bottom gradient overlay for better text readability -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-20 pointer-events-none"></div>
        </div>

        <!-- Video description -->
        <div class="text-center mt-8">
          <p class="text-sm text-foreground/60 max-w-xl mx-auto">
            See how Magic Social helps you craft perfect tweets and replies with AI-powered suggestions,
            tone customization, and real-time engagement optimization.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Magic Social -->
  <section class="py-20 px-4">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Why use Magic Social?</h2>
        <p class="text-lg text-foreground/60 max-w-2xl mx-auto">
          It’s never been easier to stay connected on Twitter.
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto saturate-150">
            ⚡
          </div>
          <h3 class="text-xl font-semibold mb-3">Reply in Seconds</h3>
          <p class="text-foreground/60 leading-relaxed">
            Perfect replies with AI-powered prompts.
          </p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto saturate-150">
            📈
          </div>
          <h3 class="text-xl font-semibold mb-3">Growth by engaging</h3>
          <p class="text-foreground/60 leading-relaxed">
            See your likes, replies, and follower growth.
          </p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto saturate-150">
            🎯
          </div>
          <h3 class="text-xl font-semibold mb-3">Stay Consistent</h3>
          <p class="text-foreground/60 leading-relaxed">
            No more excuses, you can reply easily.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <ClientOnly>
    <Suspense>
      <TestimonialsSection :testimonials="tweetTestimonials" />
      <template #fallback>
        <div class="py-20 px-4 bg-muted/30">
          <div class="container max-w-full mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">Loved by Makers</h2>
              <p class="text-lg text-foreground/60">Loading testimonials...</p>
            </div>
            <div class="bg-muted/30 relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
              <div class="animate-pulse">Loading amazing testimonials...</div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </ClientOnly>

  <!-- Features -->
  <ClientOnly>
    <Suspense>
      <FeaturesSection />
      <template #fallback>
        <div class="py-20 px-4 bg-muted/10">
          <div class="container max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">Features</h2>
              <p class="text-lg text-foreground/60">Loading amazing features...</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div v-for="i in 6" :key="i" class="border border-border rounded-xl p-6 animate-pulse">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </ClientOnly>

  <!-- FAQ -->
  <ClientOnly>
    <Suspense>
      <FAQSection />
      <template #fallback>
        <div class="py-24 px-4 bg-muted/10">
          <div class="container max-w-6xl mx-auto">
            <div class="text-center">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p class="text-lg text-foreground/60">Loading FAQ...</p>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </ClientOnly>

  <!-- CTA Section -->
  <ClientOnly>
    <Suspense>
      <CTASection />
      <template #fallback>
        <div class="relative h-96 w-full bg-muted/10 flex items-center justify-center">
          <div class="text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Do you want to be a magician? ✨</h2>
            <p class="text-lg text-foreground/60">Loading magical CTA...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </ClientOnly>

  <!-- Founder Section -->
  <ClientOnly>
    <Suspense>
      <FounderSection />
      <template #fallback>
        <div class="py-20 px-4 border-t border-border bg-muted/20">
          <div class="container max-w-4xl mx-auto text-center">
            <h3 class="text-2xl font-bold mb-4">Built by makers, for makers</h3>
            <p class="text-lg text-foreground/60">Loading founder section...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </ClientOnly>
</template>
