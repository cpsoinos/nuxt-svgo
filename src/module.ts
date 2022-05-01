import { defineNuxtModule, addVitePlugin } from "@nuxt/kit";
import svgLoader from "vite-svg-loader";
import type { OptimizeOptions } from "svgo";

export interface ModuleOptions {
  svgoConfig?: OptimizeOptions;
  svgo?: boolean;
  defaultImport?: "url" | "raw" | "component";
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-svgo",
    configKey: "svgo",
  },
  defaults: {
    svgo: true,
    defaultImport: "component",
  },
  setup(options) {
    addVitePlugin(svgLoader(options));
  },
});
