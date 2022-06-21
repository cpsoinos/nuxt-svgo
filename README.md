# `nuxt-svgo`

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]
[![Twitter: CoreyPsoinos][twitter-src]][twitter-href]

`nuxt-svgo` is a Nuxt module to load optimized SVG files as Vue components.

Try it on [StackBlitz](https://stackblitz.com/edit/nuxt-svgo-playground?file=nuxt.config.ts)!

## Install

### Using `npm`

```sh
npm install nuxt-svgo --save-dev
```

### Using `yarn`

```sh
yarn add nuxt-svgo -D
```

### Using `pnpm`

```sh
pnpm add nuxt-svgo -D
```

## Usage

Use the [default configuration](https://github.com/cpsoinos/nuxt-svgo/blob/689aa0c20622fc287b12cb361a29aa2977f7cfa2/src/module.ts#L19-L22) by adding `'nuxt-svgo'` to the `modules` section of your Nuxt config.

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo']
})
```

Then, in any `.vue` file, import your asset and use it as a component:

```vue
<script setup lang="ts">
import IconHome from '~/assets/icon-home.svg'
</script>

<template>
  <div>
    <IconHome class="w-5 h-5" />
  </div>
</template>
```

## How it works

### Vite

If your Nuxt app uses Vite, this module adds [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) to the underlying Vite configuration. All due credit for `vite-svg-loader` to its author, [@jpkleemans](https://github.com/jpkleemans).

### Webpack

If your Nuxt app uses Webpack, this module adds [svg-to-vue-component](https://github.com/egoist/svg-to-vue-component) to the underlying Webpack configuration. All due credit for `svg-to-vue-component` to its author, [@egoist](https://github.com/egoist).

## Configuration

Use your own custom SVGO options:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgoOptions: {
    svgoConfig: {
      multipass: true,
      removeViewBox: false,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // customize default plugin options
              inlineStyles: {
                onlyMatchedOnce: false
              },

              // or disable plugins
              removeDoctype: false
            }
          }
        }
      ]
    }
  }
})
```

Disable SVGO entirely:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgoOptions: {
    svgo: false
  }
})
```

## Development

- Run `pnpm dev:prepare` to generate type stubs.
- Use `pnpm dev` to start [playground](./playground) in development mode.

## Author

**Corey Psoinos**

- Twitter: [@CoreyPsoinos](https://twitter.com/CoreyPsoinos)
- Github: [@cpsoinos](https://github.com/cpsoinos)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Corey Psoinos](https://github.com/cpsoinos).

This project is [MIT](https://github.com/cpsoinos/nuxt-svgo/blob/main/LICENSE) licensed.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-svgo/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-svgo
[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-svgo.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-svgo
[license-src]: https://img.shields.io/npm/l/nuxt-svgo.svg?style=flat-square
[license-href]: https://github.com/cpsoinos/nuxt-svgo/blob/main/LICENSE
[twitter-src]: https://img.shields.io/twitter/follow/CoreyPsoinos.svg?style=social
[twitter-href]: https://twitter.com/CoreyPsoinos
