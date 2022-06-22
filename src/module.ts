import { defineNuxtModule, addVitePlugin, extendWebpackConfig } from '@nuxt/kit'
import svgLoader from 'vite-svg-loader'

type OptimizeOptions = Parameters<typeof svgLoader>[0]['svgoConfig']

export interface ModuleOptions {
  defaultImport?: 'url' | 'raw' | 'component'
  svgo?: boolean
  svgoConfig?: OptimizeOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-svgo',
    configKey: 'svgoOptions',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    svgo: true,
    defaultImport: 'component'
  },

  setup(options) {
    addVitePlugin(svgLoader(options))

    extendWebpackConfig((config) => {
      const svgRule = config.module.rules.find((rule) => rule.test.test('svg'))

      if (svgRule) svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.(vue|js|ts|svg)$/,
        use: [
          'vue-loader',
          {
            loader: 'svg-to-vue-component/loader',
            options: {
              svgoConfig: options.svgo ? options.svgoConfig : options.svgo
            }
          }
        ]
      })
    })
  }
})
