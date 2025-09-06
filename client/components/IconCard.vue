<template>
  <NCard class="truncate text-gray-500/75 p-4 hover:bg-active">
    <div class="flex items-center justify-center">
      <h1 text="base 5xl" class="mb-2" h-5 w-5 v-html="icon.content" />
    </div>
    <div class="flex items-center justify-center">
      <pre>{{ componentTag }}</pre>
    </div>
    <div>
      <small>{{ unoptimizedText }}</small>
    </div>
    <div>
      <small>{{ optimizedText }}</small>
    </div>
  </NCard>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['icon'])
const icon = props.icon

const componentTag = computed(() => '<' + icon.componentName + ' />')
const unoptimizedText = computed(() => 'Unoptimized: ' + icon.unoptimizedSize + ' bytes')
const optimizedText = computed(() => 'Optimized: ' + icon.optimizedSize + ' bytes')
</script>
