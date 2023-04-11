import NuxtSVGO from '..'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  builder: 'webpack',
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
