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
 * taken from: https://github.com/svg/svgo/blob/73f7002ab614554446e26acf1552c2505448b96f/plugins/prefixIds.js#L13
 * with edits for avoiding same file name collisions
 * extract basename from path 
 */
function getUniqueBasename(path: string) {
  // extract everything after latest slash or backslash
  const matched = path.match(/[/\\]?([^/\\]+)$/);
  if (matched) {
    return matched[1] + (path.match(/[/\\]/g)?.length || 0);
  }
  return '';
};

/**
 * taken from: https://github.com/svg/svgo/blob/73f7002ab614554446e26acf1552c2505448b96f/plugins/prefixIds.js#L26
 * escapes a string for being used as ID
 */
function escapeIdentifierName(str: string) {
  return str.replace(/[. ]/g, '_');
};

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
          return escapeIdentifierName(getUniqueBasename(info.path));
        },
      }
    }
  ]
}

export type ModuleOptions = SvgLoaderOptions & {
  autoImportPath?: string
  global?: boolean
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
    defaultImport: 'componentext',
    autoImportPath: './assets/icons/',
    svgoConfig: undefined,
    global: true
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
        prefix: 'svgo',
        watch: true
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
            options: options.svgoConfig || defaultSvgoConfig
          }
        ].filter(Boolean)
      })
    })
  }
})

export default nuxtSvgo
