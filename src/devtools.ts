import { existsSync, readdirSync, statSync, readFileSync, globSync } from 'node:fs'
import { join } from 'node:path'
import { createResolver, useNuxt } from '@nuxt/kit'
import { addCustomTab, extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { joinURL } from 'ufo'
import { optimize } from 'svgo'
import type { ClientFunctions, ServerFunctions, SvgIcon, IconsResponse } from './rpc-types'
import { defaultSvgoConfig, ModuleOptions } from './module'

const RPC_NAMESPACE = 'nuxt-svgo-rpc'

function scanSvgFiles(dir: string, baseDir = dir): string[] {
  let results: string[] = []
  const list = readdirSync(dir)
  for (const file of list) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(scanSvgFiles(filePath, baseDir))
    } else if (stat && stat.isFile() && file.endsWith('.svg')) {
      results.push(filePath)
    }
  }
  return results
}

/**
 * Collects all SVG icons from the configured icon paths
 */
function collectSvgIcons(options: ModuleOptions, iconPaths: string[]): Array<SvgIcon> {
  const allIcons: Array<SvgIcon> = []

  for (const iconPath of iconPaths) {
    const icons = scanSvgFiles(iconPath).map<SvgIcon>((path) => {
      const name = path.split('/').pop()?.replace('.svg', '')[0]
      const content = readFileSync(join(path), 'utf-8')
      const optimizedContent = optimize(content, {
        ...(options.svgoConfig || defaultSvgoConfig),
        path,
      }).data
      return {
        componentName: options.componentPrefix ? `${options.componentPrefix}-${name}` : name,
        path,
        content: optimizedContent,
        name,
        unoptimizedSize: Buffer.byteLength(content, 'utf8'),
        optimizedSize: Buffer.byteLength(optimizedContent, 'utf8'),
      }
    })
    allIcons.push(...icons)
  }

  return allIcons
}

export const setupDevtools = (options: ModuleOptions, iconPaths: string[]) => {
  const nuxt = useNuxt()
  const { resolve } = createResolver(import.meta.url)
  const clientPath = resolve(__dirname, './client')

  const isProductionBuild = existsSync(clientPath)
  const DEVTOOLS_UI_PATH = '/__nuxt-svgo-devtools'
  const DEVTOOLS_UI_PORT = 3300

  console.log('isProductionBuild', isProductionBuild, 'clientPath', clientPath)

  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const { default: sirv } = await import('sirv')
      server.middlewares.use(DEVTOOLS_UI_PATH, sirv(clientPath, { dev: false, single: true }))
    })
  } else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_PATH] = {
        target: `http://localhost:${DEVTOOLS_UI_PORT}${DEVTOOLS_UI_PATH}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_PATH, ''),
      }
    })
  }

  // Register the devtools tab
  addCustomTab({
    name: 'nuxt-svgo',
    title: 'SVG Icons',
    icon: 'carbon:svg',
    view: {
      type: 'iframe',
      src: joinURL(nuxt.options.app.baseURL || '/', DEVTOOLS_UI_PATH),
    },
  })

  // Setup RPC functions
  onDevToolsInitialized(() => {
    extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
      // Get specific icon by component name
      getIcon(componentName: string): Promise<SvgIcon | null> {
        const icons = collectSvgIcons(options, iconPaths)
        const icon = icons.find((i) => i.componentName === componentName)
        return Promise.resolve(icon || null)
      },

      // List all icons
      listIcons(): Promise<IconsResponse> {
        const icons = collectSvgIcons(options, iconPaths)
        return Promise.resolve({
          componentPrefix: options.componentPrefix,
          icons,
        })
      },
    })
  })
}
