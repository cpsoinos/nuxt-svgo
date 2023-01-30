import NuxtSVGO from '../../../../src/module'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  builder: 'webpack',
  svgo: {
    svgo: false
  }
})
