<script setup>
// SEO
useHead({
  title: 'Privacy Policy - Magic Social',
  meta: [
    { name: 'description', content: 'Privacy Policy for Magic Social - AI-powered Twitter Chrome Extension.' },
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

    <!-- Privacy Content -->
    <section class="py-16 px-4">
      <div class="container max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-foreground/60 mb-8">Last updated: July 2, 2025</p>
          
          <h2>1. Information We Collect</h2>
          <p>Magic Social collects minimal information to provide our service:</p>
          <ul>
            <li><strong>Account Information:</strong> When you sign up with Google, we collect your name, email address, and profile picture from your Google account.</li>
            <li><strong>Usage Data:</strong> We collect basic usage statistics to improve our service, such as feature usage frequency and error logs.</li>
            <li><strong>Payment Information:</strong> Payment processing is handled by third-party providers. We don't store your payment details.</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Magic Social service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates and support communications</li>
            <li>Improve our product based on usage patterns</li>
          </ul>
          
          <h2>3. Data Processing and Storage</h2>
          <p><strong>Client-Side Processing:</strong> Magic Social processes your content locally in your browser. Your drafts, tweets, and AI-generated content never leave your device unless you choose to post them on Twitter.</p>
          <p><strong>No Content Storage:</strong> We don't store or have access to the content you create or generate using Magic Social.</p>
          
          <h2>4. Third-Party Services</h2>
          <p>Magic Social integrates with:</p>
          <ul>
            <li><strong>Google:</strong> For authentication (Google Sign-in)</li>
            <li><strong>OpenAI:</strong> For AI content generation (processed locally)</li>
            <li><strong>Payment Processors:</strong> For handling subscriptions</li>
          </ul>
          
          <h2>5. Data Security</h2>
          <p>We implement appropriate security measures to protect your information. Since content processing happens locally in your browser, your content remains private and secure.</p>
          
          <h2>6. Data Retention</h2>
          <p>We retain your account information for as long as your account is active. If you delete your account, we'll remove your personal information within 30 days.</p>
          
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we have about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          
          <h2>8. Cookies and Tracking</h2>
          <p>We use minimal cookies necessary for service functionality, such as keeping you logged in. We don't use tracking cookies for advertising.</p>
          
          <h2>9. Children's Privacy</h2>
          <p>Magic Social is not intended for users under 13 years of age. We don't knowingly collect information from children under 13.</p>
          
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or through the extension.</p>
          
          <h2>11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or want to exercise your rights, please contact us through our support channels.</p>
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
          <NuxtLink to="/terms" class="text-sm text-foreground/60 hover:text-foreground transition-colors">
            Terms
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
