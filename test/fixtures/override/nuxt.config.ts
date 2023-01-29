import NuxtSVGO from '../../../src/module'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  svgo: {
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // customize default plugin options
              inlineStyles: {
                onlyMatchedOnce: false
              },

              // or disable plugins
              removeViewBox: false
            }
          }
        }
      ]
    }
  }
})
