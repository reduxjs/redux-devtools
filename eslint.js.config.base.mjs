import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([eslint.configs.recommended, eslintConfigPrettier]);
