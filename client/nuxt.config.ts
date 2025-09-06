export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  app: {
    baseURL: '/__nuxt-svgo-devtools',
  },
  nitro: {
    output: {
      publicDir: '../dist/client',
    },
  },
  modules: ['@nuxt/devtools-ui-kit'],
})
