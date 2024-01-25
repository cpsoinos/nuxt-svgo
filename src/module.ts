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
import type { Config } from 'svgo'
import { SvgLoaderOptions, svgLoader } from './loaders/vite'

/**
 * taken from: https://stackoverflow.com/a/8831937/3542461
 */
function hashCode(str: string) {
  let hash = 0
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const defaultSvgoConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false
        }
      }
    },
    'removeDimensions',
    {
      name: 'prefixIds',
      params: {
        prefix(_, info) {
          return 'i' + hashCode(info.path!)
        }
      }
    }
  ]
}

export type ModuleOptions = SvgLoaderOptions & {
  /** Defaults to `svgo` */
  componentPrefix?: string
  global?: boolean
}

const nuxtSvgo: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
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
    defaultImport: 'componentext',
    autoImportPath: './assets/icons/',
    svgoConfig: undefined,
    global: true,
    customComponent: 'NuxtIcon',
    componentPrefix: 'svgo'
  },
  async setup(options) {
    const { resolvePath, resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'nuxt-icon',
      filePath: resolve('./runtime/components/nuxt-icon.vue')
    })

    addVitePlugin(
      svgLoader({
        ...options,
        svgoConfig: options.svgoConfig || defaultSvgoConfig
      })
    )

    if (options.autoImportPath) {
      addComponentsDir({
        path: await resolvePath(options.autoImportPath),
        global: options.global,
        extensions: ['svg'],
        prefix: options.componentPrefix || 'svgo',
        watch: true
      })
    }

    extendWebpackConfig((config) => {
      const svgRule = config.module?.rules?.find((rule) => {
        if (
          typeof rule === 'object' &&
          !!rule &&
          'test' in rule &&
          rule.test instanceof RegExp
        ) {
          return rule.test.test('.svg')
        } else {
          return false
        }
      })
      // @ts-ignore
      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module?.rules?.push({
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
            options: options.svgoConfig || defaultSvgoConfig
          }
        ].filter(Boolean)
      })
    })
  }
})

export default nuxtSvgo
