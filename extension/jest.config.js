module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(d3)/)'],
  resolver: '<rootDir>/jestResolver.js',
};
