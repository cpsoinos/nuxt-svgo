import { defineNuxtModule, addVitePlugin, extendWebpackConfig } from '@nuxt/kit'
import { OptimizeOptions } from 'svgo'
import svgLoader from 'vite-svg-loader'

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
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      if (svgRule) svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.(vue|js|ts|svg)$/,
        use: ['vue-loader', 'svg-to-vue-component/loader'],
        options: {
          svgoConfig: config.svgo ? config.svgoConfig : config.svgo
        }
      })
    })
  }
})
