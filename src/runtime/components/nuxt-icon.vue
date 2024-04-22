<template>
  <component
    :is="icon"
    :class="{
      'nuxt-icon': fontControlled,
      'nuxt-icon--fill': !filled,
    }"
  />
</template>

<script lang="ts">
  // file imported from https://github.com/gitFoxCode/nuxt-icons/blob/89e53649e5868c31fc97869918ede96504ae1a04/src/runtime/components/nuxt-icon.vue
  // with modifications

  export default {
    props: {
      filled: {
        type: Boolean,
        required: false,
        default: false,
      },
      fontControlled: {
        type: Boolean,
        required: false,
        default: true,
      },
      icon: {
        type: Object,
        required: true,
      },
      name: {
        type: String,
        required: false,
      },
    },
  }
</script>

<style>
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
