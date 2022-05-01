import { defineNuxtModule, addVitePlugin } from "@nuxt/kit";
import { OptimizeOptions } from "svgo";
import svgLoader from "vite-svg-loader";

export interface ModuleOptions {
  svgoConfig?: OptimizeOptions;
  svgo?: boolean;
  defaultImport?: "url" | "raw" | "component";
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-svgo",
    configKey: "svgoOptions",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    svgo: true,
    defaultImport: "component",
  },
  setup(options) {
    addVitePlugin(svgLoader(options));
  },
});
