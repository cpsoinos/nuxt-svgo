import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: ['src/module'],
  rollup: {
    emitCJS: true
  },
  externals: ['svgo', '@nuxt/kit', '@nuxt/types']
})
