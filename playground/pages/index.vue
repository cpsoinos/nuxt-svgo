<template>
  <div>
    Nuxt module playground!
    <Home />
    <svgo-home style="color: green; font-size: 40px" />
    sweet
    <svgo-home filled :fontControlled="false" />
  </div>
  <div>
    url encoded svg:
    <img :src="HomeUri" />
  </div>
  <div>
    with clashing ids (left visible, right invisible):
    <br />
    <svgo-homeid />
    <svgo-sub-homeid />
  </div>
</template>

<script setup>
  import Home from '~/assets/home.svg'
  import HomeUri from '~/assets/home-ns.svg?url_encode'
</script>
