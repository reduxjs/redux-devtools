module.exports = {
  extends: '../../eslintrc.js.base.json',
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
      files: ['demo/**/*.ts', 'demo/**/*.tsx'],
      extends: '../../eslintrc.ts.react.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./demo/tsconfig.json'],
      },
    },
    {
      files: ['demo/config/webpack.config.ts'],
      extends: '../../eslintrc.ts.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./demo/config/tsconfig.json'],
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
  ],
};
