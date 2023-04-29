import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type { NuxtConfig } from 'nuxt/schema'
import type { ModuleOptions } from '../src/module'

describe('options override test', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/default', import.meta.url)),
    nuxtConfig: {
      svgo: {
        defaultImport: 'component',
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // customize default plugin options
                  inlineStyles: {
                    onlyMatchedOnce: false
                  }

                  // or disable plugins
                  // removeViewBox: false
                }
              }
            }
          ]
        }
      } as ModuleOptions
    } as NuxtConfig
  })

  it('renders the svg removing the viewBox', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')

    writeFileSync('./test.log', html, { encoding: 'utf-8' })
    // default config of module removes dimensions and adds viewbox
    expect(html).toContain(
      '<svg width="24" height="24"><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path></svg>'
    )
  })
})
