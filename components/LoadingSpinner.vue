<template>
  <div class="inline-flex items-center space-x-2">
    <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
    <span class="text-sm text-foreground/60">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>
