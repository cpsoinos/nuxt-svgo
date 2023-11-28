// this file has been copied from: https://github.com/jpkleemans/vite-svg-loader/blob/6a416f22453dd761a49e3a77d3a539fdd834c207/index.js
// with modifications and ts conversion.

import { readFile } from 'node:fs/promises'
import { extname, basename } from 'node:path'
import { compileTemplate } from '@vue/compiler-sfc'
import { optimize as optimizeSvg, Config } from 'svgo'
import urlEncodeSvg from 'mini-svg-data-uri'

export interface SvgLoaderOptions {
  autoImportPath?: string | false
  /** The name of component in CapitalCase that will be used in `componentext` import type. defaults to `NuxtIcon` */
  customComponent: string
  defaultImport?:
    | 'url'
    | 'url_encode'
    | 'raw'
    | 'raw_optimized'
    | 'component'
    | 'skipsvgo'
    | 'componentext'
  /** should the svg loader plugin work only if an import query is explicitly used?
   * this only affects SVGs outside of `autoImportPath` */
  explicitImportsOnly?: boolean
  svgo?: boolean
  svgoConfig?: Config
}

export function svgLoader(options?: SvgLoaderOptions) {
  const {
    svgoConfig,
    svgo,
    defaultImport,
    explicitImportsOnly,
    autoImportPath,
    customComponent
  } = options || {}

  const normalizedCustomComponent = customComponent.includes('-')
    ? customComponent
        .split('-')
        .map((c) => c[0].toUpperCase() + c.substring(1).toLowerCase())
        .join('')
    : customComponent

  const autoImportPathNormalized =
    autoImportPath && autoImportPath.replaceAll(/^\.*(?=[/\\])/g, '')

  const svgRegex =
    /\.svg(\?(url_encode|raw|raw_optimized|component|skipsvgo|componentext))?$/
  const explicitImportRegex =
    /\.svg(\?(url_encode|raw|raw_optimized|component|skipsvgo|componentext))+$/

  return {
    name: 'svg-loader',
    enforce: 'pre' as const,

    async load(id: string) {
      if (!id.match(svgRegex)) {
        return
      }

      const [path, query] = id.split('?', 2)

      if (explicitImportsOnly) {
        const isExplicitlyQueried = id.match(explicitImportRegex)
        if (!isExplicitlyQueried) {
          if (autoImportPathNormalized) {
            if (!path.includes(autoImportPathNormalized)) {
              return
            }
          } else {
            return
          }
        }
      }

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

      if (importType === 'raw_optimized') {
        return `export default ${JSON.stringify(svg)}`
      }

      // To prevent compileTemplate from removing the style tag
      svg = svg
        .replace(/<style/g, '<component is="style"')
        .replace(/<\/style/g, '</component')

      const svgName = extname(path) === '.svg' ? basename(path, '.svg') : '';

      let { code } = compileTemplate({
        id: JSON.stringify(id),
        source: svg,
        filename: path,
        transformAssetUrls: false
      })

      if (importType === 'componentext') {
        code =
          `import {${normalizedCustomComponent}} from "#components";\nimport {h} from "vue";\n` +
          code

        code += `\nexport default { render() { return h(${normalizedCustomComponent}, {icon: {render}, name: "${svgName}"}) } }`
        return code
      } else {
        return `${code}\nexport default { render: render }`
      }
    }
  }
}

export default svgLoader
