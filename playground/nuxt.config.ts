import { defineNuxtConfig } from 'nuxt'
import NuxtSVGO from '..'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  svgo: {
    svgo: true,
    defaultImport: 'component'
  }
})
