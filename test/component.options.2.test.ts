import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, stopServer } from '@nuxt/test-utils'

describe('component (different auto import)', () => {
  describe('test group', async () => {
    await setup({
      rootDir: fileURLToPath(new URL('./fixtures/component', import.meta.url)),
      nuxtConfig: {
        svgo: {
          autoImportPath: './assets/other-icons/'
        }
      }
    })

    it('renders the svg as expected', async () => {
      const html = await $fetch('/')

      // this home icon's path is different from the 'assets/icons/home.svg' icon path
      expect(html).toContain(
        `><path d="M13.5 1.515c-.928-.536-4.889 2.14-5.817 2.676L3 5.845c-.619.357-.775 6.144-.775 6.859l2.225 7.395C4.61 20.627 2.448 22 3 22h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6c.552 0-.651-2.086-.577-2.634L22 7.577c0-.715-1.818-.192-2.437-.549z"></path></svg>`
      )
    })
  })
})
