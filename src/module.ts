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
    configKey: 'svgo',
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
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'vue-loader',
          {
            loader: 'vue-svg-loader',
            options: options.svgo ? options.svgoConfig : options.svgo
          }
        ]
      })
    })
  }
})
