module.exports = {
  extends: '../../eslintrc.js.base.json',
  overrides: [
    {
      files: ['*.ts'],
      extends: '../../eslintrc.ts.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: true,
      },
    },
  ],
};
