import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('default options', async () => {
  await setup({
    rootDir: fileURLToPath(
      new URL('../fixtures/webpack/default', import.meta.url)
    )
  })

  it('renders the svg', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')

    expect(html).toContain(
      '<svg height="24" width="24"><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path></svg>'
    )
  })
})
