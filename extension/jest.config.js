module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|@babel/code-frame|@babel/highlight|@babel/helper-validator-identifier|chalk|d3|dateformat|delaunator|internmap|jsondiffpatch|lodash-es|nanoid|robust-predicates|uuid)',
  ],
};
