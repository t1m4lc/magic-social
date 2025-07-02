<script setup>
import { AnimatedTooltip } from '~/components/ui/animated-tooltip'
import { ShimmerButton } from '~/components/ui/shimmer-button'
import { Marquee } from '~/components/ui/marquee'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import RainbowButton from '~/components/ui/rainbow-button/RainbowButton.vue'
import { Motion } from "motion-v";
import AuroraBackground from '~/components/ui/aurora-background/AuroraBackground.vue'
import BlackHoleBackground from '~/components/ui/bg-black-hole/BlackHoleBackground.vue'

// SEO
useHead({
  title: 'Magic Social - AI-powered Twitter Chrome Extension',
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

// Features data
const features = [
  {
    title: 'Reply & Create Prompts',
    description: 'Prebuilt scenarios and 100% custom prompts in one click.',
    icon: '💬'
  },
  {
    title: 'In‑Context Customization',
    description: 'Add voice, style or extra details inline, no separate UI.',
    icon: '✨'
  },
  {
    title: 'Growth by engaging',
    description: 'See real-time improvements in your likes, replies, and follower growth.',
    icon: '📊'
  },
  {
    title: 'Tone & Global Instructions',
    description: 'Choose your tone (casual, witty, pro) and set global rules for consistency.',
    icon: '🎯'
  },
  {
    title: 'One‑Click Google Signup',
    description: 'Access with your Google account, secure and instant.',
    icon: '🔐'
  },
  {
    title: '100% Client‑Side Processing',
    description: 'All AI runs in your browser, your drafts never leave you.',
    icon: '🛡️'
  }
]

const faqs = [
  {
    question: "Which platform does Magic Social support?",
    answer: "Only Twitter for now, focused, fast, friction‑free. We're building the best possible experience for Twitter before expanding to other platforms."
  },
  {
    question: "Do I need technical skills to use Magic Social?",
    answer: "Not at all! Magic Social is designed to be extremely user-friendly. Simply install the Chrome extension and start using it directly on Twitter. No setup required."
  },
  {
    question: "Does Magic Social include scheduling or planning features?",
    answer: "Not yet. We generate perfect drafts; you hit Tweet or Reply. Our focus is on helping you craft better content in real-time, not managing your posting schedule."
  },
  {
    question: "Do I need an account to use Magic Social?",
    answer: "Yes, signup is required, but it's just one click with Google. No extra forms or passwords needed. Your data stays secure and private."
  },
  {
    question: "How does the AI generate replies and tweets?",
    answer: "Magic Social uses advanced AI to analyze context and generate relevant, engaging content. All processing happens in your browser, so your drafts never leave your device."
  }
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center space-x-2">
          <span class="text-xl saturate-150">✨</span>
          <span class="font-semibold text-lg">Magic Social</span>
        </div>
        <nav class="hidden md:flex items-center space-x-6 text-sm">
          <a href="#demo" class="text-foreground/60 hover:text-foreground transition-colors">Demo</a>
          <a href="#features" class="text-foreground/60 hover:text-foreground transition-colors">Features</a>
          <a href="#testimonials" class="text-foreground/60 hover:text-foreground transition-colors">Reviews</a>
        </nav>
        <ShimmerButton class="px-4 py-2 text-sm hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000">
          Install Extension
        </ShimmerButton>
      </div>
    </header>

    <!-- Hero Section -->
    <section>
      <AuroraBackground>
        <div class="py-20 px-4">
          <div class="container max-w-4xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Turn 10 minutes into 10× Twitter engagement
            </h1>
            <p class="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered Chrome extension that helps you craft better tweets, replies, and grow your presence smarter.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <RainbowButton class="px-8 py-4 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000">
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

    <!-- Extension in Action -->
    <section id="demo" class="py-20 px-4 bg-muted/10">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Magic Social in Action</h2>
          <p class="text-lg text-foreground/60">Look how easy it is to craft perfect tweets and replies</p>
        </div>
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 border border-border/50 shadow-lg">
            <div class="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <span class="text-6xl mb-4 block saturate-150">🎬</span>
                <p class="text-lg font-semibold text-foreground/80">Extension Demo</p>
                <p class="text-sm text-foreground/60">GIF: Magic Social generating tweets in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-20 px-4 bg-muted/30">
      <div class="container max-w-full mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Loved by Makers</h2>
          <p class="text-lg text-foreground/60">Here's what our users say about Magic Social</p>
        </div>

        <!-- Marquee testimonials -->
        <div class="bg-muted/30 relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
          <!-- First Marquee -->
          <Marquee :pause-on-hover="true" class="[--duration:25s]">
            <div v-for="tweet in tweetTestimonials.slice(0, 4)" :key="tweet.id" class="mx-4">
              <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
                <!-- Tweet Header -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <img :src="tweet.avatar" :alt="tweet.name" class="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <div class="flex items-center space-x-1">
                        <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                        <!-- Verified badge -->
                        <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
                    </div>
                  </div>
                  <!-- Twitter logo -->
                  <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>

                <!-- Tweet Content -->
                <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

                <!-- Tweet Actions -->
                <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                  <div class="flex items-center space-x-6">
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>{{ tweet.comments }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span>{{ tweet.retweets }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{{ tweet.likes }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div v-for="tweet in tweetTestimonials.slice(4, 8)" :key="tweet.id" class="mx-4">
              <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
                <!-- Tweet Header -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <img :src="tweet.avatar" :alt="tweet.name" class="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <div class="flex items-center space-x-1">
                        <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                        <!-- Verified badge -->
                        <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
                    </div>
                  </div>
                  <!-- Twitter logo -->
                  <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>

                <!-- Tweet Content -->
                <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

                <!-- Tweet Actions -->
                <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                  <div class="flex items-center space-x-6">
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>{{ tweet.comments }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span>{{ tweet.retweets }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{{ tweet.likes }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div v-for="tweet in tweetTestimonials.slice(8)" :key="tweet.id" class="mx-4">
              <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow transition-shadow duration-300 max-w-sm">
                <!-- Tweet Header -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <img :src="tweet.avatar" :alt="tweet.name" class="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <div class="flex items-center space-x-1">
                        <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ tweet.name }}</p>
                        <!-- Verified badge -->
                        <svg class="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ tweet.handle }} · {{ tweet.timestamp }}</p>
                    </div>
                  </div>
                  <!-- Twitter logo -->
                  <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>

                <!-- Tweet Content -->
                <p class="text-gray-900 dark:text-gray-100 leading-relaxed mb-4 text-sm">{{ tweet.content }}</p>

                <!-- Tweet Actions -->
                <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                  <div class="flex items-center space-x-6">
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>{{ tweet.comments }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span>{{ tweet.retweets }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{{ tweet.likes }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 px-4 bg-muted/10">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <p class="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to supercharge your Twitter presence
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="border border-border rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div class="text-3xl mb-4 saturate-150">{{ feature.icon }}</div>
            <h3 class="text-lg font-semibold mb-3">{{ feature.title }}</h3>
            <p class="text-foreground/60 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-24 px-4 bg-muted/10">
      <div class="container max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row gap-12">
          <!-- Left side - Title and contact info -->
          <div class="flex flex-col text-left basis-1/2">
            <h2 class="text-3xl font-bold sm:text-4xl mb-5">
              Frequently
              <span class="text-black dark:text-white font-bold">
                Asked Questions
              </span>
            </h2>
            <p class="text-muted-foreground mb-6">
              Have another question? Contact me on
              <a href="https://twitter.com/timothyalcaide" rel="noopener" target="_blank" class="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline font-medium transition-colors">
                Twitter
              </a>
              or by
              <a href="mailto:timothyalcaide+magic@gmail.com" rel="noopener" target="_blank" class="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline font-medium transition-colors">
                email
              </a>.
            </p>
          </div>

          <!-- Right side - FAQ Accordion -->
          <div class="basis-1/2">
            <Accordion type="single" collapsible class="w-full">
              <AccordionItem v-for="(faq, index) in faqs" :key="faq.question" :value="`item-${index}`" class="border-t border-border">
                <AccordionTrigger class="text-left py-5 text-base font-medium md:text-lg hover:no-underline">
                  {{ faq.question }}
                </AccordionTrigger>
                <AccordionContent class="pb-5 leading-relaxed text-muted-foreground">
                  {{ faq.answer }}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->

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
            <ShimmerButton class="px-8 py-4 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform duration-200" shimmer-color="#ffffff" background="#000000">
              ✨ Become a Twitter Magician
            </ShimmerButton>
          </div>
        </div>
      </section>
    </section>

    <!-- Founder Section -->
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
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow me on Twitter
            </a>
          </div>
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
  </div>
</template>
