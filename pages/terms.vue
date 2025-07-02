<script setup>
// SEO
useHead({
  title: 'Terms of Service - Magic Social',
  meta: [
    { name: 'description', content: 'Terms of Service for Magic Social - AI-powered Twitter Chrome Extension.' },
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl">✨</span>
          <span class="font-bold text-xl">Magic Social</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-foreground/60 hover:text-foreground transition-colors">
          ← Back to Home
        </NuxtLink>
      </div>
    </header>

    <!-- Terms Content -->
    <section class="py-16 px-4">
      <div class="container max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Terms of Service</h1>
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-foreground/60 mb-8">Last updated: July 2, 2025</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By using Magic Social, you agree to these Terms of Service. If you don't agree, please don't use our service.</p>
          
          <h2>2. Description of Service</h2>
          <p>Magic Social is a Chrome extension that provides AI-powered assistance for creating and replying to content on Twitter/X. The service uses artificial intelligence to help users generate engaging social media content.</p>
          
          <h2>3. User Accounts</h2>
          <p>You must create an account using Google Sign-in to use Magic Social. You're responsible for keeping your account secure and for all activities that occur under your account.</p>
          
          <h2>4. Acceptable Use</h2>
          <p>You agree to use Magic Social only for lawful purposes and in accordance with these Terms. You may not:</p>
          <ul>
            <li>Use the service to generate harmful, offensive, or illegal content</li>
            <li>Attempt to reverse engineer or copy the service</li>
            <li>Use the service to spam or harass other users</li>
            <li>Violate Twitter's Terms of Service while using our extension</li>
          </ul>
          
          <h2>5. Privacy and Data</h2>
          <p>Magic Social processes content locally in your browser. We don't store your drafts or personal content. Please see our Privacy Policy for more details.</p>
          
          <h2>6. Payment and Billing</h2>
          <p>Magic Social is a paid service. By subscribing, you agree to pay the applicable fees. Subscriptions renew automatically unless cancelled.</p>
          
          <h2>7. Cancellation</h2>
          <p>You may cancel your subscription at any time. Upon cancellation, you'll retain access until the end of your current billing period.</p>
          
          <h2>8. Limitation of Liability</h2>
          <p>Magic Social is provided "as is" without warranties. We're not liable for any damages arising from your use of the service.</p>
          
          <h2>9. Changes to Terms</h2>
          <p>We may update these Terms from time to time. We'll notify users of significant changes via email or through the extension.</p>
          
          <h2>10. Contact</h2>
          <p>If you have questions about these Terms, please contact us through our support channels.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border/40 py-8 px-4">
      <div class="container max-w-6xl mx-auto text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <span class="text-2xl">✨</span>
          <span class="font-bold text-xl">Magic Social</span>
        </div>
        <div class="flex justify-center space-x-6">
          <NuxtLink to="/" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Home
          </NuxtLink>
          <NuxtLink to="/pricing" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Pricing
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Privacy
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.prose h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
  opacity: 0.8;
}

.prose ul {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
  list-style-type: disc;
  opacity: 0.8;
}
</style>
