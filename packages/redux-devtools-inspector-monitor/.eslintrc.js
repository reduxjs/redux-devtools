module.exports = {
  extends: '../../eslintrc.ts.react.base.json',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  overrides: [
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
  ],
};
