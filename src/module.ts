import { defineNuxtModule, addVitePlugin, extendWebpackConfig } from '@nuxt/kit'
import { OptimizeOptions } from 'svgo'
import svgLoader from 'vite-svg-loader'

export interface ModuleOptions {
  svgoConfig?: OptimizeOptions
  svgo?: boolean
  defaultImport?: 'url' | 'raw' | 'component'
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-svgo',
    configKey: 'svgoOptions',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    svgo: true,
    defaultImport: 'component',
  },

  async setup(options) {
    addVitePlugin(svgLoader(options))

    // webpack 4/5
    extendWebpackConfig((config) => {
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.(vue|js|ts|svg)$/,
        use: ['vue-loader', 'svg-to-vue-component/loader'],
        options: {
          svgoConfig: config.svgo ? config.svgoConfig : config.svgo,
        },
      })
    })
  },
})
