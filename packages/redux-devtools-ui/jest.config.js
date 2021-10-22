module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/tests/__mocks__/styleMock.ts',
  },
};
