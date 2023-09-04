module.exports = {
  extends: '../../../eslintrc.ts.react.base.json',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  overrides: [
    {
      files: ['webpack.config.ts'],
      extends: '../../../eslintrc.ts.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.webpack.json'],
      },
    },
  ],
};
