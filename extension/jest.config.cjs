module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|@babel/code-frame|@babel/highlight|@babel/helper-validator-identifier|@redux-devtools/instrument|@x0k/json-schema-merge|chalk|color|d3|dateformat|delaunator|internmap|jsondiffpatch|js-tokens|lodash-es|nanoid|robust-predicates|uuid)',
  ],
};
