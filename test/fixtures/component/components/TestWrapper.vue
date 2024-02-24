<template>
  <component
    :is="icon"
    :class="{
      'test-icon': fontControlled,
      'test--fill': !filled,
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
    },
  }
</script>

<style>
  .test-icon {
    width: 1em;
    height: 1em;
    margin-bottom: 0.125em;
    vertical-align: middle;
  }
  .test--fill,
  .test--fill * {
    fill: currentColor;
  }
</style>
