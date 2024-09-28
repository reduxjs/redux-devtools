module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|@babel/code-frame|@babel/highlight|@babel/helper-validator-identifier|chalk|d3|dateformat|delaunator|internmap|jsondiffpatch|lodash-es|nanoid|robust-predicates|uuid)',
  ],
};
