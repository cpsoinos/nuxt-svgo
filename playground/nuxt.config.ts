import NuxtSVGO from '..'
import { defaultSvgoConfig } from '../src/module'

export default defineNuxtConfig({
  modules: [NuxtSVGO],
  svgo: {
    explicitImportsOnly: false,
    dts: true,
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
              removeDoctype: false,
              // Note: removeViewBox is no longer part of preset-default in SVGO v4.
              // viewBox is preserved by default — no override needed.
            },
          },
        },
        defaultSvgoConfig.plugins![defaultSvgoConfig.plugins!.length - 1],
      ],
    },
  },
})
