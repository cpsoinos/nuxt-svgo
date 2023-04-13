<template>
  <IconComponent
    :class="{
      'nuxt-icon': fontControlled,
      'nuxt-icon--fill': !filled
    }"
  />
</template>

<script setup lang="ts">
// file imported from https://github.com/gitFoxCode/nuxt-icons/blob/89e53649e5868c31fc97869918ede96504ae1a04/src/runtime/components/nuxt-icon.vue
// with some modifications
import { h, markRaw, watch } from '#imports'

const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
  import: 'default',
  eager: true,
  query: {
    component: ''
  }
})

function IconNotFound(name: string) {
  return {
    setup() {
      return () =>
        h('span', { innerHTML: `<!-- icon with name "${name}" not found -->` })
    }
  }
}

const props = withDefaults(
  defineProps<{
    name: string
    fontControlled?: boolean
    filled?: boolean
  }>(),
  { filled: false, fontControlled: true }
)

const IconComponent = markRaw(
  iconsImport[`/assets/icons/${props.name}.svg`] || IconNotFound(props.name)
)

watch(
  () => props.name,
  () => {
    const component = iconsImport[`/assets/icons/${props.name}.svg`]
    if (!component) {
      console.error(
        `[nuxt-svgo] Icon '${props.name}' doesn't exist in 'assets/icons'`
      )
      IconComponent.value = IconNotFound(props.name)
    } else {
      IconComponent.value = component
    }
  }
)
</script>

<style scoped>
.nuxt-icon {
  width: 1em;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
}
.nuxt-icon--fill,
.nuxt-icon--fill * {
  fill: currentColor;
}
</style>
