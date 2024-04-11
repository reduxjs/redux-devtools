module.exports = {
  extends: '../../eslintrc.js.base.json',
  overrides: [
    {
      files: ['*.ts'],
      extends: '../../eslintrc.ts.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: true,
      },
    },
    {
      files: ['test/**/*.ts'],
      extends: '../../eslintrc.ts.jest.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.test.json'],
      },
    },
  ],
};
