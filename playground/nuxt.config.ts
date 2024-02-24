import NuxtSVGO from '..'
import { defaultSvgoConfig } from '../src/module'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  svgo: {
    explicitImportsOnly: false,
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // customize default plugin options
              inlineStyles: {
                onlyMatchedOnce: false,
              },

              // or disable plugins
              removeViewBox: false,
            },
          },
        },
        defaultSvgoConfig.plugins![defaultSvgoConfig.plugins!.length - 1],
      ],
    },
  },
})
