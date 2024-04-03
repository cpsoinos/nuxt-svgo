# `nuxt-svgo`

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]
[![Twitter: CoreyPsoinos][twitter-src]][twitter-href]

`nuxt-svgo` is a Nuxt module to load optimized SVG files as Vue components.

Try it on [StackBlitz](https://stackblitz.com/edit/nuxt-svgo-playground?file=nuxt.config.ts)!

## Install

```sh
npx nuxi@latest module add nuxt-svgo
```

## Usage

Use the [default configuration](https://github.com/cpsoinos/nuxt-svgo/blob/b30c65b5e3d034a1cb198bf351355de34d02ac92/src/module.ts#L14-L26) by adding `'nuxt-svgo'` to the `modules` section of your Nuxt config.

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
})
```

Then, in any `.vue` file, import your asset and use it as a component:

```vue
<template>
  <div>
    <!-- font size controls width & height by default: -->
    <IconHome class="text-xl" />
    <!-- you can disable it: -->
    <IconHome class="w-5 h-5" :fontControlled="false" />
  </div>
</template>

<script setup lang="ts">
  import IconHome from '~/assets/icon-home.svg'
</script>
```

Or, if you use **vite**, in any `.vue` file, simply use your icon's name with `svgo` prefix as component name:

```vue
<template>
  <div>
    <SvgoHome class="text-xl" />
    <!-- Or -->
    <svgo-home class="text-xl" />
  </div>
</template>
```

It automatically imports your icons from `assets/icons/` folder by default. you can configure this by passing `autoImportPath` in your config:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    autoImportPath: './assets/other-icons/',
  },
})
```

If you want to use auto import but you don't want to use the `nuxt-icon` component (used by default), You can do so by using `defaultImport: 'component'`:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    defaultImport: 'component',
  },
})
```

You can also use your own custom component instead of the built-in `nuxt-icon` component using the `customComponent` option.
This custom component must have `icon` property, just like the `nuxt-icon` component [provided by nuxt-svgo](https://github.com/cpsoinos/nuxt-svgo/blob/main/src/runtime/components/nuxt-icon.vue).

Example:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    customComponent: 'YourComponent',
  },
})
```

By default module registers all icons inside `autoImportPath` globally. This may be unwanted behavior as it generates chunks for each icon to be used globally, which will result in huge amount of files if you have many icons. If you want to disable global registration simply use `global: false` in module options:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    global: false,
  },
})
```

to disable auto importing, simply set `autoImportPath` to `false`:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    autoImportPath: false,
  },
})
```

### Subfolders

The icons's component name will follow Nuxt's component prefix convention. Therefore, if prefix is turned on for your components, the component name for `assets/icons/admin/badge.svg`, for example, will be `svgo-admin-badge`:

```html
<svgo-admin-badge />
```

### `componentPrefix`

You can change the default prefix (`svgo`) to your custom prefix using `componentPrefix` option:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    componentPrefix: 'i',
  },
})
```

```jsx
// in your template
<template>
  <div>
    <i-home />
  </div>
</template>
```

## How it works

### Vite

If your Nuxt app uses Vite, this module adds [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) to the underlying Vite configuration. All due credit for `vite-svg-loader` to its author, [@jpkleemans](https://github.com/jpkleemans).

We use a modified copy of this vite plugin for auto loading icons with extra control using a `nuxt-icon` component.

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
                onlyMatchedOnce: false,
              },

              // or disable plugins
              removeDoctype: false,
              removeViewBox: false,
            },
          },
        },
      ],
    },
  },
})
```

Disable SVGO entirely:

```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt-svgo'],
  svgo: {
    svgo: false,
  },
})
```

## Import queries (Vite.js only)

Here are the possible queries when importing a SVG file:

- `url_encode`: loads optimized svg as data uri (uses svgo + `mini-svg-data-uri`)
- `raw`: loads contents as text
- `raw_optimized`: loads optimized svg as text
- `skipsvgo`: loads contents as a component (unoptimized, without `nuxt-icon`)
- `component`: loads optimized svg as a component
- `componentext`: loads optimized svg with `nuxt-icon` component

for example:

```vue
<template>
  <div>
    <IconHome />
  </div>
</template>

<script setup lang="ts">
  import IconHome from '~/assets/icon-home.svg?componentext' // the default
</script>
```

## Important note for `url_encode` query

`xmlns="http://www.w3.org/2000/svg"` attribute is required for uri data to work. in some rare cases, it may not be there. make sure it exists when using `url_encode` query or the image will not be shown.

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

Originally copied over from the [nuxt-icons module](https://github.com/gitFoxCode/nuxt-icons/blob/89e53649e5868c31fc97869918ede96504ae1a04/src/runtime/components/nuxt-icon.vue), but later heavily modified to support tree shaking and SSR. This is not intended to be used directly. However, you can import your icons directly and pass them to the component using the `icon` prop.

### Component props

- `filled`: use icon's original colors when `true`
- `fontControlled`: you can disable the default behavior of scaling by font size by setting this prop to `false`
- `icon`: the component that `nuxt-icon` will render as. this is used internally to provide control over the icon.

## Migrating from v1.x to v2.x

If you were using the `nuxt-icon` component before, you have to change your code like this:

```html
<!-- from: -->
<nuxt-icon name="home" filled />
<nuxt-icon name="special/home" filled />
<!-- to: -->
<svgo-home filled />
<svgo-special-home filled />
```

## Migrating from v2.x to v3.x

v3 now uses an opinionated default config for svgo by default, to make it work like before simply pass `{}` to `svgoConfig` option:

```ts
export default defineNuxtConfig({
  // ...
  svgo: {
    svgoConfig: {},
  },
})
```

also since v3 `simpleAutoImport` option is removed and `defaultImport` is changed to `componentext`. if you were using the following code, and relying on the `defaultImport`, change it:

```vue
<template>
  <div>
    <IconHome class="text-xl" />
  </div>
</template>

<script setup lang="ts">
  // change this:
  import IconHome from '~/assets/icon-home.svg'
  // to this:
  import IconHome from '~/assets/icon-home.svg?component'
</script>
```

## Development

- Run `pnpm dev:prepare` to generate type stubs.
- Use `pnpm dev` to start [playground](./playground) in development mode.

## Authors

**Corey Psoinos**

- Twitter: [@CoreyPsoinos](https://twitter.com/CoreyPsoinos)
- Github: [@cpsoinos](https://github.com/cpsoinos)

**Javad Mnjd**

- Github: [@jd1378](https://github.com/jd1378)

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
