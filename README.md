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

If your Nuxt app uses Webpack, this module adds [vue-svg-loader](https://github.com/damianstasik/vue-svg-loader) and [svgo-loader](https://github.com/svg/svgo-loader) to the underlying Webpack configuration. As discussed in [this issue](https://github.com/damianstasik/vue-svg-loader#156), `vue-svg-loader` uses version 1 of SVGO. `vue-svg-loader` looks to be unmaintained, with the latest beta release more than 2 years old. We disable the SVGO functionality of `vue-svg-loader`, instead relying on `svgo-loader` to perform optimizations, essentially making `vue-svg-loader` wrap the svg content in `<template></template>` tags.

All due credit for `vue-svg-loader` to its author, [@damianstasik](https://github.com/damianstasik).
All due credit for `svgo-loader` to its author, [@svg](https://github.com/svg).

Make sure peer dependencies of this module (`vue-svg-loader`,`svgo-loader`, `vue-loader`) are installed if you are using webpack.

## Configuration

Use your own custom SVGO options:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
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
              },

              // or disable plugins
              removeDoctype: false,
              removeViewBox: false
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
  svgo: {
    svgo: false
  }
})
```

## Usage with TypeScript

When importing a SVG component in TypeScript, you will get a "Cannot find module" error. In order to fix thix, you need to provide a type declaration to tell TypeScript how to handle SVG components. Here's an example, using a `custom.d.ts` file at the application's root:

```ts
// custom.d.ts
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```

## `nuxt-icon` component

### Notes

Due to how this component works, it only works on projects with vite (webpack is not supported)

This component is very similar to `nuxt-icons` module's component, in fact the code was originally copied over from `nuxt-icons` module, but it has been modified to work in SSR.

### Usage

1. Create `icons` folder in `assets`: `assets/icons`
2. Drop your icons with the `.svg` extension into the `icons` folder
3. In your project, use `<nuxt-icon name="">`, where name is the name of your svg icon from the folder

If you need to use the original color from the svg file (for example, if your icon has defs) you need to use the filled attribute

<nuxt-icon name="myLogoIcon" filled />

### Subfolders

If you would like to use some more complicated folder arrangement you will have to use paths from /icons

If you have a svg icon in nested directories such as:

```
📁icons
  └📁admin
  ⠀⠀└ badge.svg
  └📁user
  ⠀⠀└ badge.svg
```

then the icons's name will be based on its own path directory and filename. Therefore, the icon's name will be:

```html
<nuxt-icon name="admin/badge">
  and <nuxt-icon name="user/badge"></nuxt-icon
></nuxt-icon>
```

### Component props

- `name`: name of the icon to be used
- `filled`: use icon's original colors when `true`
- `fontControlled`: you can disable the default behavior of scaling by font size by setting this prop to `false`

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

Copyright © 2023 [Corey Psoinos](https://github.com/cpsoinos).

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
