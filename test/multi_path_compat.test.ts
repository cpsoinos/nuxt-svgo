import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type { NuxtConfig } from 'nuxt/schema'
import type { ModuleOptions } from '../src/module'

const HOUSE_PATH = `><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732z"></path>`
const STAR_PATH = `><path d="M13.5 1.515c-.928-.536-4.889 2.14-5.817 2.676L3 5.845c-.619.357-.775 6.144-.775 6.859l2.225 7.395C4.61 20.627 2.448 22 3 22h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6c.552 0-.651-2.086-.577-2.634L22 7.577c0-.715-1.818-.192-2.437-.549z"></path>`

describe('autoImportPath: single string (backward compatibility)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/multi_path', import.meta.url)),
    nuxtConfig: {
      svgo: {
        autoImportPath: './assets/icons/',
      } as ModuleOptions,
    } as NuxtConfig,
  })

  it('should render an svg from the configured path', async () => {
    const html = await $fetch('/')
    expect(html).toContain(HOUSE_PATH)
  })

  it('should not render an svg from an unconfigured path', async () => {
    const html = await $fetch('/')
    expect(html).not.toContain(STAR_PATH)
  })
})
