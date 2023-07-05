import { fileURLToPath } from 'node:url'
import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type { NuxtConfig } from 'nuxt/schema'
import type { ModuleOptions } from '../src/module'

describe('defaultImport: url_encode', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/echo', import.meta.url)),
    nuxtConfig: {
      svgo: {
        defaultImport: 'url_encode'
      } as ModuleOptions
    } as NuxtConfig
  })

  it('returns the url encoded text of svg', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain(
      'data:image/svg+xml,%3csvg xmlns=&#39;http://www.w3.org/2000/svg&#39; viewBox=&#39;0 0 24 24&#39;%3e%3cpath d=&#39;M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z&#39;/%3e%3c/svg%3e'
    )
  })
})
