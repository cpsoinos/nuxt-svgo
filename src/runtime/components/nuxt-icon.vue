<template>
  <component
    :is="IconComponent"
    :class="{
      'nuxt-icon': fontControlled,
      'nuxt-icon--fill': !filled
    }"
  />
</template>

<script lang="ts">
// file imported from https://github.com/gitFoxCode/nuxt-icons/blob/89e53649e5868c31fc97869918ede96504ae1a04/src/runtime/components/nuxt-icon.vue
// with some modifications
import { shallowRef, watch, h } from '#imports'

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

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    filled: {
      type: Boolean,
      required: false,
      default: false
    },
    fontControlled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(props) {
    const IconComponent = shallowRef(
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

    return {
      IconComponent
    }
  }
}
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
