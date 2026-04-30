import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt()
  .prepend({
    ignores: ['dist', 'node_modules', 'playground', '**/*.d.ts'],
  })
  .append({
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
    },
  })
