import { defineNuxtConfig } from 'nuxt'
import NuxtSVGO from '..'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  svgoOptions: {
    svgo: true,
    defaultImport: 'component'
  }
})
