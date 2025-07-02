<script setup>
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
</script>

<template>
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
          <div class="text-3xl mb-4 saturate-150" role="img" :aria-label="feature.title">{{ feature.icon }}</div>
          <h3 class="text-lg font-semibold mb-3">{{ feature.title }}</h3>
          <p class="text-foreground/60 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
