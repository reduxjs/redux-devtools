module.exports = {
  extends: '../../eslintrc.ts.react.base.json',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: ['test/**/*.ts', 'test/**/*.tsx'],
      extends: '../../eslintrc.ts.react.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./test/tsconfig.json'],
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
      files: ['webpack.config.ts'],
      extends: '../../eslintrc.ts.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.webpack.json'],
      },
    },
  ],
};
