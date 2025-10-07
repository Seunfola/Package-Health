// eslint.config.js
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const rxjsPlugin = require('eslint-plugin-rxjs');

module.exports = tseslint.config(
  // TypeScript & Angular files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'], // ✅ point here
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier,
    ],
    plugins: {
      prettier: prettierPlugin,
      rxjs: rxjsPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ✅ Prettier
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
        },
      ],

      // ✅ Angular Style Rules
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // ✅ RxJS Best Practices
      'rxjs/no-ignored-subscription': 'error',
      'rxjs/no-async-subscribe': 'error',
      'rxjs/no-nested-subscribe': 'warn',
      'rxjs/finnish': [
        'error',
        {
          functions: false,
          methods: false,
          parameters: true,
          properties: true,
          variables: true,
        },
      ],
    },
  },

  // HTML templates
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettier,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },
);
