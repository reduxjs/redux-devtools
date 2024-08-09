import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import eslintConfigPrettier from 'eslint-config-prettier';

export default (tsconfigRootDir) => [
  {
    files: ['test/**/*.ts'],
    ...eslint.configs.recommended,
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    files: ['test/**/*.ts'],
    ...config,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    files: ['test/**/*.ts'],
    ...config,
  })),
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.test.json'],
        tsconfigRootDir,
      },
    },
  },
  {
    files: ['test/**/*.ts'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['test/**/*.ts'],
    ...jest.configs['jest/style'],
  },
  {
    files: ['test/**/*.ts'],
    ...eslintConfigPrettier,
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
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
    },
  },
];
