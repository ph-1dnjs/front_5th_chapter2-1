import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const globals = {
  document: 'readonly',
  window: 'readonly',
  alert: 'readonly',
  setTimeout: 'readonly',
  setInterval: 'readonly',
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals,
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'no-var': 'error',
      'no-unused-vars': 'error',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
    },
  },
  prettierConfig,
];
