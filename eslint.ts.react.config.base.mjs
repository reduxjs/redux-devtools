import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import { fixupPluginRules } from '@eslint/compat';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default (
  tsconfigRootDir,
  files = ['**/*.ts', '**/*.tsx'],
  project = true,
) => [
  {
    files,
    ...eslint.configs.recommended,
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    files,
    ...config,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    files,
    ...config,
  })),
  {
    files,
    languageOptions: {
      parserOptions: {
        project,
        tsconfigRootDir,
      },
    },
  },
  {
    files,
    ...react.configs.flat.recommended,
  },
  {
    files,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files,
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
  },
  {
    files,
    ...eslintConfigPrettier,
  },
  {
    files,
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      'react/prop-types': 'off',
    },
  },
];
