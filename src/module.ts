/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  defineNuxtModule,
  addVitePlugin,
  extendWebpackConfig,
  createResolver
} from '@nuxt/kit'
import svgLoader from 'vite-svg-loader'

type OptimizeOptions = Parameters<typeof svgLoader>[0]['svgoConfig']

export interface ModuleOptions {
  defaultImport?: 'url' | 'raw' | 'component'
  svgo?: boolean
  svgoConfig?: OptimizeOptions
}

export default defineNuxtModule({
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

  setup(options, nuxt) {
    addVitePlugin(svgLoader(options))

    extendWebpackConfig((config) => {
      // @ts-ignore
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
      // @ts-ignore
      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      const { resolve } = createResolver(import.meta.url)
      const runtimeDir = resolve('./runtime')
      nuxt.options.build.transpile.push(runtimeDir)

      config.module?.rules?.push({
        test: /\.svg$/,
        use: [
          resolve(runtimeDir, 'webpack-vue-svg-loader')
          // 'vue-loader',
          // {
          //   loader: 'vue-svg-loader',
          //   options: {
          //     svgo: false
          //   }
          // },
          // options.svgo && {
          //   loader: 'svgo-loader',
          //   options: options.svgoConfig || {}
          // }
        ].filter(Boolean)
      })
    })
  }
})
