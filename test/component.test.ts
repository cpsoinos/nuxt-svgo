import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('component', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/component', import.meta.url))
  })

  it('works regardless of `defaultImport` settings', async () => {
    const html = await $fetch('/')

    expect(html).toContain(
      `><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6"></path></svg>`
    )
  })

  it('renders the svg from assets/icons folder', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')

    expect(html).toContain(
      '><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path></svg>'
    )
    expect(html).toContain(
      '><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6"></path></svg>'
    )
  })

  it('it renders an span with a comment saying icon does not exist when icon name is not found', async () => {
    const html = await $fetch('/')

    expect(html).toContain(
      `><!-- icon with name "nonexisting" not found --></span>`
    )
  })
})
