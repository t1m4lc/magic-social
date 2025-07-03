<template>
  <div class="relative">
    <!-- Loading skeleton -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-muted/20 rounded-lg flex items-center justify-center z-10"
    >
      <div class="flex flex-col items-center space-y-4">
        <!-- Spinning loader -->
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
        <p class="text-sm text-foreground/60">Loading video...</p>
      </div>
    </div>
    
    <!-- Video/Media content -->
    <div class="transition-opacity duration-300" :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }">
      <slot :loading="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  loadingDuration: {
    type: Number,
    default: 1500 // Default loading time in milliseconds
  }
})

const isLoading = ref(true)

onMounted(() => {
  // Simulate loading time or wait for actual media to load
  setTimeout(() => {
    isLoading.value = false
  }, props.loadingDuration)
  
  // If it's an image, we can also listen for the load event
  if (props.src.endsWith('.gif') || props.src.endsWith('.jpg') || props.src.endsWith('.png')) {
    const img = new Image()
    img.onload = () => {
      isLoading.value = false
    }
    img.onerror = () => {
      isLoading.value = false // Still hide loader on error
    }
    img.src = props.src
  }
})
</script>
