/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  defineNuxtModule,
  addVitePlugin,
  extendWebpackConfig,
  createResolver,
  addComponentsDir,
  addComponent
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'
import { SvgLoaderOptions, svgLoader } from './loaders/vite'

export type ModuleOptions = SvgLoaderOptions & {
  autoImportPath?: string
  simpleAutoImport?: boolean
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
    svgoConfig: {},
    autoImportPath: './assets/icons/',
    simpleAutoImport: false
  },
  async setup(options) {
    const { resolvePath, resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'nuxt-icon',
      filePath: resolve('./runtime/components/nuxt-icon.vue')
    })

    addVitePlugin(svgLoader(options))

    if (options.autoImportPath) {
      addComponentsDir({
        path: await resolvePath(options.autoImportPath),
        global: true,
        extensions: ['svg'],
        prefix: 'svgo',
        watch: true,
        extendComponent(component) {
          component.filePath =
            component.filePath +
            (options.simpleAutoImport ? '?component' : '?componentext')
        }
      })
    }

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
