import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  entries: ["src/module"],
  externals: ["svgo", "@nuxt/kit", "@nuxt/types"],
});
