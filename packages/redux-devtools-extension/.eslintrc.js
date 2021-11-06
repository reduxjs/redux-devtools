module.exports = {
  extends: '../../eslintrc.ts.base.json',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
