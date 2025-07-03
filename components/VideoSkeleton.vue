<template>
  <div class="animate-pulse">
    <div 
      class="bg-muted rounded-lg"
      :class="aspectRatio"
      :style="{ width: width, height: height }"
    >
      <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center space-y-3">
          <div class="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-muted-foreground/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-muted-foreground/20 rounded w-24"></div>
            <div class="h-2 bg-muted-foreground/10 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'auto'
  },
  aspectRatio: {
    type: String,
    default: 'aspect-video'
  }
})
</script>
