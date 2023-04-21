<template>
  <div>
    Nuxt module playground!
    <Home />
    <svgo-home style="color: green; font-size: 40px" />
    sweet
    <svgo-home filled :fontControlled="false" />
  </div>
</template>

<script setup>
import Home from '~/assets/home.svg'
</script>
