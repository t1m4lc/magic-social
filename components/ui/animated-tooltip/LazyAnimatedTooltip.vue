<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from "vue";

interface Item {
  id: number;
  name: string;
  designation: string;
  image: string;
}

const props = defineProps<{
  items: Item[];
  avatarSize?: string; // e.g., "size-14", "size-16"
}>();

const hoveredIndex = ref<number | null>(null);
const mouseX = ref<number>(0);
const hasHovered = ref<boolean>(false);

// Lazy load the tooltip component only when needed
const AnimatedTooltipContent = defineAsyncComponent(() => import('./AnimatedTooltipContent.vue'));

const rotation = computed<number>(() => {
  const x = mouseX.value;
  return (x / 100) * 50;
});

const translation = computed<number>(() => {
  const x = mouseX.value;
  return (x / 100) * 50;
});

function handleMouseEnter(event: MouseEvent, itemId: number) {
  hasHovered.value = true; // Trigger lazy loading
  hoveredIndex.value = itemId;
  const rect = (event.target as HTMLElement)?.getBoundingClientRect();
  const halfWidth = rect.width / 2;
  mouseX.value = event.clientX - rect.left - halfWidth;
}

function handleMouseMove(event: MouseEvent) {
  const rect = (event.target as HTMLElement)?.getBoundingClientRect();
  const halfWidth = rect.width / 2;
  mouseX.value = event.clientX - rect.left - halfWidth;
}

// Default to "size-14" if not provided
const avatarSizeClass = computed(() => props.avatarSize || "size-14");
</script>

<template>
  <div
    v-for="item in items"
    :key="item.id"
    class="group relative -mr-4"
    @mouseenter="(e) => handleMouseEnter(e, item.id)"
    @mouseleave="hoveredIndex = null"
    @mousemove="handleMouseMove"
  >
    <!-- Lazy loaded tooltip -->
    <Suspense v-if="hasHovered">
      <AnimatedTooltipContent
        v-if="hoveredIndex === item.id"
        :item="item"
        :translation="translation"
        :rotation="rotation"
      />
    </Suspense>

    <!-- Avatar Image with optimized loading -->
    <NuxtImg
      :src="item.image"
      :alt="`${item.name} avatar`"
      :class="`relative !m-0 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 ${avatarSizeClass}`"
      width="56"
      height="56"
      loading="eager"
      preload
    />
  </div>
</template>
