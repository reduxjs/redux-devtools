module.exports = {
  extends: '../../eslintrc.js.base.json',
  overrides: [
    {
      files: ['*.ts'],
      extends: '../../eslintrc.ts.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./test/tsconfig.json'],
      },
    },
    {
      files: ['test/**/*.ts'],
      extends: '../../eslintrc.ts.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./test/tsconfig.json'],
      },
    },
  ],
};
