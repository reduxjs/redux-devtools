module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|@babel/code-frame|@babel/highlight|@babel/helper-validator-identifier|d3|dateformat|delaunator|internmap|nanoid|robust-predicates|uuid)',
  ],
};
