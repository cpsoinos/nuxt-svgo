// this file has been copied from: https://github.com/jpkleemans/vite-svg-loader/blob/6a416f22453dd761a49e3a77d3a539fdd834c207/index.js
// with modifications and ts conversion.

import { readFile } from 'node:fs/promises'
import { compileTemplate } from '@vue/compiler-sfc'
import { optimize as optimizeSvg, Config } from 'svgo'
import { createResolver } from '@nuxt/kit'
import urlEncodeSvg from 'mini-svg-data-uri'

export interface SvgLoaderOptions {
  defaultImport?:
    | 'url'
    | 'url_encode'
    | 'raw'
    | 'component'
    | 'skipsvgo'
    | 'componentext'
  svgo?: boolean
  svgoConfig?: Config
}

export function svgLoader(options?: SvgLoaderOptions) {
  const { svgoConfig, svgo, defaultImport } = options || {}
  const { resolve } = createResolver(import.meta.url)
  const componentPath = resolve('../runtime/components/nuxt-icon.vue')

  const svgRegex = /\.svg(\?(url_encode|raw|component|skipsvgo|componentext))?$/

  return {
    name: 'svg-loader',
    enforce: 'pre' as const,

    async load(id: string) {
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

      if (importType === 'url_encode') {
        return `export default "${urlEncodeSvg(svg)}"`
      }

      
      // To prevent compileTemplate from removing the style tag
      svg = svg.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')

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
