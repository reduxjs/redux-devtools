module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
};
