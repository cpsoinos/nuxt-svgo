import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('component (simpleAutoImport option)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/component', import.meta.url)),
    nuxtConfig: {
      svgo: {
        simpleAutoImport: true
      }
    }
  })

  it('wont use the nuxt-icon component anymore', async () => {
    const html = await $fetch('/')

    expect(html).toContain(
      `><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6"></path></svg>`
    )

    expect(html).not.toContain(`nuxt-icon`)
    expect(html).not.toContain(`nuxt-icon--fill`)
  })
})
