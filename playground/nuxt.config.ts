import { defineNuxtConfig } from "nuxt";
import MyModule from "..";

export default defineNuxtConfig({
  modules: [MyModule],
  myModule: {
    svgo: true,
    defaultImport: "component",
  },
});
