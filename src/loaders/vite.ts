// this file has been copied from: https://github.com/jpkleemans/vite-svg-loader/blob/43e1d25a60e80c7a22721e458265fe196da4b997/index.js#L1
// with modifications and ts conversion.

import { readFile } from 'node:fs/promises'
import { compileTemplate } from '@vue/compiler-sfc'
import { optimize as optimizeSvg, Config } from 'svgo'
import { createResolver } from '@nuxt/kit'

export interface SvgLoaderOptions {
  defaultImport?: 'url' | 'raw' | 'component' | 'skipsvgo' | 'componentext'
  svgo?: boolean
  svgoConfig?: Config
}

export function svgLoader(options?: SvgLoaderOptions) {
  const { svgoConfig, svgo, defaultImport } = options || {}
  const { resolve } = createResolver(import.meta.url)
  const componentPath = resolve('../runtime/components/nuxt-icon.vue')

  const svgRegex = /\.svg(\?(raw|component|skipsvgo|componentext))?$/

  return {
    name: 'svg-loader',
    enforce: 'pre' as const,

    async load(id) {
      if (!id.match(svgRegex)) {
        return
      }

      const [path, query] = id.split('?', 2)

      const importType = query || defaultImport

      if (importType === 'url') {
        return // Use default svg loader
      }

      let svg

      try {
        svg = await readFile(path, 'utf-8')
      } catch (ex) {
        console.warn(
          '\n',
          `${id} couldn't be loaded by vite-svg-loader, fallback to default loader`
        )
        return
      }

      if (importType === 'raw') {
        return `export default ${JSON.stringify(svg)}`
      }

      if (svgo !== false && query !== 'skipsvgo') {
        svg = optimizeSvg(svg, {
          ...svgoConfig,
          path
        }).data
      }

      let { code } = compileTemplate({
        id: JSON.stringify(id),
        source: svg,
        filename: path,
        transformAssetUrls: false
      })

      if (importType === 'componentext') {
        code =
          `import {NuxtIcon} from "#components";\nimport {h} from "vue";\n` +
          code

        code += `\nexport default { render() { return h(NuxtIcon, {icon: {render}}) } }`
        return code
      } else {
        return `${code}\nexport default { render: render }`
      }
    }
  }
}

export default svgLoader
