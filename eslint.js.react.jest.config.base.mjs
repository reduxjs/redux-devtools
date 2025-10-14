import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...eslint.configs.recommended,
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...react.configs.flat.recommended,
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...jest.configs['jest/style'],
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    ...eslintConfigPrettier,
  },
]);
