// file: svg-to-vue-component-loader.ts

module.exports = function (content: string) {
  const componentName = this.resourcePath.split('/').pop().replace('.svg', '')

  const template = `
    <template>
      ${content}
    </template>
  `

  return `
    import * as Vue from 'vue';
    export default Vue.extend({
      name: '${componentName}',
      ${template}
    });
  `
}
