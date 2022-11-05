/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineNuxtModule, addVitePlugin, extendWebpackConfig } from '@nuxt/kit'
import svgLoader from 'vite-svg-loader'
import type { NuxtModule } from '@nuxt/schema'

type OptimizeOptions = Parameters<typeof svgLoader>[0]['svgoConfig']

export interface ModuleOptions {
  defaultImport?: 'url' | 'raw' | 'component'
  svgo?: boolean
  svgoConfig?: OptimizeOptions
}

const nuxtSvgo: NuxtModule<ModuleOptions> = defineNuxtModule({
  meta: {
    name: 'nuxt-svgo',
    configKey: 'svgo',
    compatibility: {
      // Add -rc.0 due to issue described in https://github.com/nuxt/framework/issues/6699
      nuxt: '^3.0.0-rc.0'
    }
  },
  defaults: {
    svgo: true,
    defaultImport: 'component',
    svgoConfig: {}
  },

  setup(options) {
    addVitePlugin(svgLoader(options))

    extendWebpackConfig((config) => {
      // @ts-ignore
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
      // @ts-ignore
      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'vue-loader',
          {
            loader: 'vue-svg-loader',
            options: {
              svgo: false
            }
          },
          options.svgo && {
            loader: 'svgo-loader',
            options: options.svgoConfig || {}
          }
        ].filter(Boolean)
      })
    })
  }
})

export default nuxtSvgo
