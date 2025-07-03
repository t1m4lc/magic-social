<template>
  <div class="relative overflow-hidden rounded-lg">
    <!-- Loading State -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm z-10 flex items-center justify-center"
    >
      <div class="text-center space-y-4">
        <!-- Animated loader -->
        <div class="relative mx-auto">
          <div class="w-16 h-16 border-4 border-muted-foreground/20 rounded-full animate-spin">
            <div class="absolute top-0 left-0 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        <!-- Loading text -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-foreground">{{ title }}</h3>
          <p class="text-xs text-muted-foreground">{{ subtitle }}</p>
        </div>
        
        <!-- Progress bar -->
        <div class="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        
        <!-- Progress percentage -->
        <div class="text-xs text-muted-foreground">
          {{ Math.round(progress) }}%
        </div>
      </div>
    </div>

    <!-- Content -->
    <div 
      class="transition-all duration-700 ease-out"
      :class="{ 
        'opacity-0 blur-sm scale-105': isLoading,
        'opacity-100 blur-0 scale-100': !isLoading 
      }"
    >
      <slot :loading="isLoading" :progress="progress" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** Source URL for the media */
  src: {
    type: String,
    required: true
  },
  /** Duration of loading animation in milliseconds */
  duration: {
    type: Number,
    default: 2000
  },
  /** Loading title */
  title: {
    type: String,
    default: 'Loading...'
  },
  /** Loading subtitle */
  subtitle: {
    type: String,
    default: 'Please wait while we prepare your content'
  },
  /** Media type for optimized loading */
  mediaType: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'image', 'video', 'gif'].includes(value)
  },
  /** Minimum loading duration for UX */
  minDuration: {
    type: Number,
    default: 800
  }
})

const isLoading = ref(true)
const progress = ref(0)
const startTime = ref(0)
const animationFrame = ref(null)
const mediaLoaded = ref(false)

const detectMediaType = (src) => {
  if (props.mediaType !== 'auto') return props.mediaType
  
  const extension = src.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension)) return 'image'
  if (['gif'].includes(extension)) return 'gif'
  if (['mp4', 'webm', 'ogg', 'avi'].includes(extension)) return 'video'
  return 'image'
}

const animateProgress = () => {
  const elapsed = Date.now() - startTime.value
  const targetProgress = Math.min((elapsed / props.duration) * 100, 100)
  
  progress.value += (targetProgress - progress.value) * 0.1
  
  if (progress.value < 99.9 && isLoading.value) {
    animationFrame.value = requestAnimationFrame(animateProgress)
  } else if (mediaLoaded.value && elapsed >= props.minDuration) {
    finishLoading()
  }
}

const finishLoading = () => {
  progress.value = 100
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

const loadMedia = async () => {
  const mediaType = detectMediaType(props.src)
  
  try {
    if (mediaType === 'image' || mediaType === 'gif') {
      const img = new Image()
      img.onload = () => {
        mediaLoaded.value = true
        const elapsed = Date.now() - startTime.value
        if (elapsed >= props.minDuration) {
          finishLoading()
        }
      }
      img.onerror = () => {
        mediaLoaded.value = true
        finishLoading()
      }
      img.src = props.src
    } else if (mediaType === 'video') {
      const video = document.createElement('video')
      video.onloadeddata = () => {
        mediaLoaded.value = true
        const elapsed = Date.now() - startTime.value
        if (elapsed >= props.minDuration) {
          finishLoading()
        }
      }
      video.onerror = () => {
        mediaLoaded.value = true
        finishLoading()
      }
      video.src = props.src
      video.load()
    }
  } catch (error) {
    console.warn('Error loading media:', error)
    mediaLoaded.value = true
    finishLoading()
  }
}

onMounted(() => {
  startTime.value = Date.now()
  loadMedia()
  animateProgress()
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})
</script>
