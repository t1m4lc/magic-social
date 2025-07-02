<script setup>
const props = defineProps({
  testimonials: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="testimonials" class="py-20 px-4 bg-muted/30">
    <div class="container max-w-full mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Loved by Makers</h2>
        <p class="text-lg text-foreground/60">Here's what our users say about Magic Social</p>
      </div>

      <!-- Marquee testimonials -->
      <LazyTestimonials :testimonials="testimonials" />
    </div>
  </section>
</template>
