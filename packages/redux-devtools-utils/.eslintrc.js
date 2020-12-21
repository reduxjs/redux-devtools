module.exports = {
  extends: '../../.eslintrc',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: '../../eslintrc.ts.base.json',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  ],
};
