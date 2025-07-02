<script setup>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

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
</template>
