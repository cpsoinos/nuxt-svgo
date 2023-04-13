<template>
  <div>
    Nuxt module playground!
    <Home />
    <nuxt-icon name="home" style="color: green; font-size: 40px" />
    sweet
    <nuxt-icon name="home" filled :fontControlled="false" />
    <nuxt-icon name="non-existing" />
  </div>
</template>

<script setup>
import Home from '~/assets/home.svg'
</script>
