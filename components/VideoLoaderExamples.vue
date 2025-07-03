<template>
  <div class="space-y-8">
    <!-- Example with GIF (current implementation) -->
    <div class="max-w-4xl mx-auto">
      <h3 class="text-lg font-semibold mb-4">GIF with Advanced Loader</h3>
      <div class="relative rounded-2xl overflow-hidden border shadow-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div class="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <VideoLoaderAdvanced 
            src="/showcase.gif" 
            type="gif"
            :loading-duration="2500"
            loading-text="Loading demo..."
            loading-subtext="Getting ready to show you Magic Social in action"
          >
            <template #default="{ loading, progress }">
              <img 
                src="/showcase.gif" 
                alt="Magic Social Chrome Extension Demo - AI-powered Twitter engagement in action"
                class="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out"
                :class="{ 'opacity-0 scale-95': loading, 'opacity-100 scale-100': !loading }"
                loading="lazy"
              />
            </template>
          </VideoLoaderAdvanced>
        </div>
      </div>
    </div>

    <!-- Example with Video Element -->
    <div class="max-w-4xl mx-auto">
      <h3 class="text-lg font-semibold mb-4">Video with Loader (Example)</h3>
      <div class="relative rounded-2xl overflow-hidden border shadow-2xl bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
        <div class="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <VideoLoaderAdvanced 
            src="/path/to/your/video.mp4" 
            type="video"
            :loading-duration="3000"
            loading-text="Loading video..."
            loading-subtext="Preparing high-quality video content"
          >
            <template #default="{ loading, progress }">
              <video 
                controls
                preload="metadata"
                class="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out"
                :class="{ 'opacity-0 scale-95': loading, 'opacity-100 scale-100': !loading }"
                poster="/path/to/your/poster.jpg"
              >
                <source src="/path/to/your/video.mp4" type="video/mp4">
                <source src="/path/to/your/video.webm" type="video/webm">
                Your browser does not support the video tag.
              </video>
            </template>
          </VideoLoaderAdvanced>
        </div>
      </div>
    </div>

    <!-- Simple Loading Spinner Example -->
    <div class="max-w-4xl mx-auto">
      <h3 class="text-lg font-semibold mb-4">Simple Loading Spinner</h3>
      <div class="p-8 border rounded-lg">
        <LoadingSpinner text="Loading content..." />
      </div>
    </div>

    <!-- Video Skeleton Example -->
    <div class="max-w-4xl mx-auto">
      <h3 class="text-lg font-semibold mb-4">Video Skeleton Loader</h3>
      <VideoSkeleton />
    </div>
  </div>
</template>

<script setup>
import VideoLoaderAdvanced from './VideoLoaderAdvanced.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import VideoSkeleton from './VideoSkeleton.vue'
</script>
