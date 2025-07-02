<script setup lang="ts">
import { Motion } from "motion-v";

interface Item {
  id: number;
  name: string;
  designation: string;
  image: string;
}

const props = defineProps<{
  item: Item;
  translation: number;
  rotation: number;
}>();
</script>

<template>
  <Motion
    :initial="{
      opacity: 0,
      y: 20,
      scale: 0.6,
    }"
    :animate="{
      opacity: 1,
      y: 0,
      scale: 1,
    }"
    :transition="{
      type: 'spring',
      stiffness: 260,
      damping: 10,
    }"
    :exit="{
      opacity: 0,
      y: 20,
      scale: 0.6,
    }"
    :style="{
      translateX: `${translation}px`,
      rotate: `${rotation}deg`,
    }"
    class="absolute left-1/2 -top-16 z-50 flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-xs shadow-xl"
  >
    <div
      class="absolute right-1/2 translate-x-1/2 -bottom-px z-30 h-px w-2/5 me-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
    />
    <div
      class="absolute left-1/2 -translate-x-1/2 -bottom-px z-30 h-px w-2/5 ms-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent"
    />
    <div class="relative z-30 text-base font-bold text-white">
      {{ item.name }}
    </div>
    <div class="text-xs text-white">{{ item.designation }}</div>
  </Motion>
</template>
