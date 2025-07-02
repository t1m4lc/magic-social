<script setup>
import { Button } from '~/components/ui/button'

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

// Features data
const features = [
  {
    title: 'Reply & Create Prompts',
    description: 'Prebuilt scenarios and 100% custom prompts in one click.',
    icon: '💬'
  },
  {
    title: 'In‑Context Customization',
    description: 'Add voice, style or extra details inline—no separate UI.',
    icon: '✨'
  },
  {
    title: 'Tone & Global Instructions',
    description: 'Choose your tone (casual, witty, pro) and set global rules for consistency.',
    icon: '🎯'
  },
  {
    title: 'One‑Click Google Signup',
    description: 'Access with your Google account—secure and instant.',
    icon: '🔐'
  },
  {
    title: '100% Client‑Side Processing',
    description: 'All AI runs in your browser—your drafts never leave you.',
    icon: '🛡️'
  }
]

const howItWorks = [
  {
    step: '1',
    title: 'Click in Your Chrome Toolbar',
    description: 'Open Magic Social on any Twitter compose or reply field.'
  },
  {
    step: '2',
    title: 'Generate & Reply',
    description: '• Reply Prompts – reply faster to threads, DMs or mentions\n• Create Prompts – write tweets, threads or polls from scratch'
  },
  {
    step: '3',
    title: 'Customize In‑Context',
    description: 'Add global instructions (tone, hashtags, style) or inline context right in the Twitter textarea. Tweak the AI output just like you\'d edit a draft.'
  },
  {
    step: '4',
    title: 'One‑Click Google Signup',
    description: 'Quick, secure access—no extra forms or passwords.'
  }
]

const testimonials = [
  {
    quote: "Magic Social has doubled our engagement in under 2 weeks. Zero learning curve!",
    author: "Sarah K., indie‑maker",
    handle: "@NeverCodeAlone"
  },
  {
    quote: "Finally, an extension that _just works_ on Twitter.",
    author: "DevGuru",
    role: "open‑source maintainer"
  }
]

const faqs = [
  {
    question: "Which platform?",
    answer: "Only Twitter for now—focused, fast, friction‑free."
  },
  {
    question: "Scheduling or planning?",
    answer: "Not yet. We generate perfect drafts; you hit Tweet or Reply."
  },
  {
    question: "Do I need an account?",
    answer: "Yes—signup is required, but it's just one click with Google. No extra forms or passwords."
  }
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">✨</span>
          <span class="font-bold text-xl">Magic Social</span>
        </div>
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#features" class="text-foreground/60 hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" class="text-foreground/60 hover:text-foreground transition-colors">How it Works</a>
          <a href="#testimonials" class="text-foreground/60 hover:text-foreground transition-colors">Reviews</a>
          <a href="#faq" class="text-foreground/60 hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <Button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          👉 Install
        </Button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-20 pb-16 px-4">
      <div class="container max-w-6xl mx-auto text-center">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Magic Social
          </h1>
          <p class="text-xl md:text-2xl text-foreground/80 mb-4">
            Your AI‑powered copilot for crafting, replying & growing your Twitter presence.
          </p>
          <p class="text-lg md:text-xl text-foreground/60 mb-8">
            Turn 10 minutes of work into 10× engagement—without leaving your browser.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              👉 Install Chrome Extension
            </Button>
            <p class="text-sm text-foreground/60">Free • Works on Twitter instantly</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-20 px-4 bg-muted/30">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p class="text-lg text-foreground/60 max-w-2xl mx-auto">
            Four simple steps to transform your Twitter engagement
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="item in howItWorks" :key="item.step" class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {{ item.step }}
            </div>
            <h3 class="text-lg font-semibold mb-3">{{ item.title }}</h3>
            <p class="text-sm text-foreground/60 leading-relaxed whitespace-pre-line">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual Preview -->
    <section class="py-20 px-4">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Visual Preview</h2>
          <p class="text-lg text-foreground/60">See Magic Social in action</p>
        </div>
        <div class="grid md:grid-cols-2 gap-12">
          <div class="text-center">
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 mb-4 border border-border/50">
              <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                <span class="text-4xl">🎬</span>
              </div>
            </div>
            <p class="text-sm text-foreground/60 italic">GIF: choosing "Reply" prompt and generating answer</p>
          </div>
          <div class="text-center">
            <div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl p-8 mb-4 border border-border/50">
              <div class="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center">
                <span class="text-4xl">⚡</span>
              </div>
            </div>
            <p class="text-sm text-foreground/60 italic">GIF: editing global instructions directly in Twitter</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Engagement Growth -->
    <section class="py-20 px-4 bg-muted/30">
      <div class="container max-w-6xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-8">Engagement → Growth</h2>
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-12 mb-8 border border-border/50">
            <div class="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
              <span class="text-6xl">📈</span>
            </div>
          </div>
          <blockquote class="text-lg md:text-xl text-foreground/80 italic">
            "Higher likes & replies directly correlate with follower growth—see your community expand as your engagement spikes."
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-20 px-4">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What People Are Saying</h2>
          <p class="text-lg text-foreground/60">Real feedback from indie makers and developers</p>
        </div>
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div v-for="testimonial in testimonials" :key="testimonial.author" class="bg-card border border-border rounded-xl p-8">
            <blockquote class="text-lg mb-6 leading-relaxed">
              "{{ testimonial.quote }}"
            </blockquote>
            <div class="flex items-center">
              <div>
                <p class="font-semibold">{{ testimonial.author }}</p>
                <p class="text-sm text-foreground/60">{{ testimonial.handle || testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 px-4 bg-muted/30">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p class="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to supercharge your Twitter presence
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="text-3xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-lg font-semibold mb-3">{{ feature.title }}</h3>
            <p class="text-foreground/60 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
        <div class="text-center mt-12">
          <p class="text-sm text-foreground/60 italic">(GIFs above illustrate each feature in action.)</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-20 px-4">
      <div class="container max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">FAQ</h2>
          <p class="text-lg text-foreground/60">Common questions about Magic Social</p>
        </div>
        <div class="space-y-6">
          <div v-for="faq in faqs" :key="faq.question" class="bg-card border border-border rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-3">{{ faq.question }}</h3>
            <p class="text-foreground/60">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
      <div class="container max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Do You Want to Be a Magician?</h2>
        <p class="text-lg md:text-xl text-foreground/80 mb-8">
          Magic reply—it's like magic, transforming your Twitter drafts instantly.
        </p>
        <Button size="lg" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
          👉 Install Chrome Extension
        </Button>
      </div>
    </section>

    <!-- Founder Note -->
    <section class="py-20 px-4 bg-muted/30">
      <div class="container max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">A Note from the Founder</h2>
        </div>
        <div class="bg-card border border-border rounded-xl p-8 md:p-12">
          <blockquote class="text-lg leading-relaxed mb-6">
            Hey, I'm Timothy (AKA t1m4lc), a 31‑year‑old maker who's built Chrome extensions in public. I know how much time social media <em>shouldn't</em> cost you. That's why I built Magic Social—to give you your time back and let you focus on what matters: building and shipping.
          </blockquote>
          <blockquote class="text-lg leading-relaxed mb-6">
            Let's grow together.
          </blockquote>
          <p class="text-foreground/60">— Timothy</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border/40 py-12 px-4">
      <div class="container max-w-6xl mx-auto text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <span class="text-2xl">✨</span>
          <span class="font-bold text-xl">Magic Social</span>
        </div>
        <p class="text-foreground/60 mb-4">AI-powered Twitter Chrome Extension</p>
        <p class="text-sm text-foreground/40">Built for indie makers and developers • Made with ❤️</p>
      </div>
    </footer>
  </div>
</template>
