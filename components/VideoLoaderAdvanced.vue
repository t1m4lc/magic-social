<template>
  <div class="relative">
    <!-- Loading overlay -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-20"
    >
      <div class="flex flex-col items-center space-y-4">
        <!-- Pulse animation with video icon -->
        <div class="relative">
          <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-foreground">{{ loadingText }}</p>
          <p class="text-xs text-foreground/60 mt-1">{{ loadingSubtext }}</p>
        </div>
        <!-- Progress bar -->
        <div class="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary transition-all duration-300 ease-out"
            :style="{ width: `${loadingProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Video/Media content -->
    <div 
      class="transition-all duration-500 ease-out"
      :class="{ 
        'opacity-0 scale-95': isLoading, 
        'opacity-100 scale-100': !isLoading 
      }"
    >
      <slot :loading="isLoading" :progress="loadingProgress" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  loadingDuration: {
    type: Number,
    default: 2000
  },
  loadingText: {
    type: String,
    default: 'Loading video...'
  },
  loadingSubtext: {
    type: String,
    default: 'Please wait while we prepare your content'
  },
  type: {
    type: String,
    default: 'image', // 'image', 'video', 'gif'
    validator: (value) => ['image', 'video', 'gif'].includes(value)
  }
})

const isLoading = ref(true)
const loadingProgress = ref(0)
const loadingInterval = ref(null)

const startLoadingAnimation = () => {
  loadingProgress.value = 0
  const increment = 100 / (props.loadingDuration / 50) // Update every 50ms
  
  loadingInterval.value = setInterval(() => {
    loadingProgress.value += increment
    if (loadingProgress.value >= 100) {
      loadingProgress.value = 100
      clearInterval(loadingInterval.value)
    }
  }, 50)
}

const stopLoading = () => {
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
  }
  loadingProgress.value = 100
  setTimeout(() => {
    isLoading.value = false
  }, 200) // Small delay for smooth transition
}

onMounted(() => {
  startLoadingAnimation()
  
  if (props.type === 'image' || props.type === 'gif') {
    const img = new Image()
    img.onload = () => {
      // Wait for minimum loading time or actual load, whichever is longer
      setTimeout(() => {
        stopLoading()
      }, Math.max(0, props.loadingDuration - (Date.now() - startTime)))
    }
    img.onerror = () => {
      stopLoading()
    }
    const startTime = Date.now()
    img.src = props.src
  } else if (props.type === 'video') {
    const video = document.createElement('video')
    video.onloadeddata = () => {
      setTimeout(() => {
        stopLoading()
      }, Math.max(0, props.loadingDuration - (Date.now() - startTime)))
    }
    video.onerror = () => {
      stopLoading()
    }
    const startTime = Date.now()
    video.src = props.src
  } else {
    // Fallback to timeout
    setTimeout(() => {
      stopLoading()
    }, props.loadingDuration)
  }
})
</script>
