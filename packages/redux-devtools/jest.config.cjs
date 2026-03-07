module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|@redux-devtools/instrument)',
  ],
};
