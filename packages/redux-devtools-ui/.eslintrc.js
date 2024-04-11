module.exports = {
  extends: ['../../eslintrc.js.base.json', 'plugin:storybook/recommended'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: '../../eslintrc.ts.react.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: true,
      },
    },
    {
      files: ['test/**/*.ts', 'test/**/*.tsx'],
      extends: '../../eslintrc.ts.react.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.test.json'],
      },
    },
    {
      files: ['.storybook/**/*.ts', '.storybook/**/*.tsx'],
      extends: '../../eslintrc.ts.react.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./.storybook/tsconfig.json'],
      },
    },
  ],
};
