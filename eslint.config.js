import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...compat.config({
    root: true,

    parserOptions: {
      sourceType: 'module',
    },

    extends: ['@metamask/eslint-config'],

    overrides: [
      {
        files: ['*.js'],
        extends: ['@metamask/eslint-config-nodejs'],
      },

      {
        files: ['*.ts', '*.tsx', '*.svelte'],
        extends: ['@metamask/eslint-config-typescript'],
      },

      {
        files: ['*.test.ts', '*.test.js'],
        extends: ['@metamask/eslint-config-jest'],
        rules: {
          '@typescript-eslint/no-shadow': [
            'error',
            { allow: ['describe', 'expect', 'it'] },
          ],
        },
      },
    ],

    ignorePatterns: [
      '!.prettierrc.js',
      '**/!.eslintrc.js',
      '**/dist*/',
      '**/*__GENERATED__*',
      '**/build',
      '**/public',
      '**/.cache',
    ],
  }),
];
