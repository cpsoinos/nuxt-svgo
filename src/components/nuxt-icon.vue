<template>
  <IconComponent 
    :class="{
      'nuxt-icon' :fontControlled,
      'nuxt-icon--fill': !filled 
    }"
  />
</template>

<script lang="ts">

const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
  import: 'default',
  eager: true,
});

</script>

<script setup lang="ts">
// file imported from https://github.com/gitFoxCode/nuxt-icons/blob/89e53649e5868c31fc97869918ede96504ae1a04/src/runtime/components/nuxt-icon.vue
// with some modifications
import { markRaw, watch } from '#imports'

const props = withDefaults(defineProps<{
  name: string;
  fontControlled?: boolean;
  filled?: boolean
}>(), { filled: false, fontControlled: true })


const IconComponent = markRaw(iconsImport[`/assets/icons/${props.name}.svg`])

watch(() => props.name, () => {
  IconComponent.value = iconsImport[`/assets/icons/${props.name}.svg`];
  if (!IconComponent.value) {
    console.error(
      `[nuxt-svgo] Icon '${props.name}' doesn't exist in 'assets/icons'`
    )
  } 
})
</script>

<style>
.nuxt-icon svg {
  width: 1em;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
}
.nuxt-icon--fill,
.nuxt-icon--fill * {
  fill: currentColor !important;
}
</style>