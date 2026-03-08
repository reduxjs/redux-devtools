import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createJsWithTsEsmPreset({
  tsconfig: 'tsconfig.json',
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/examples'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
  },
};

export default jestConfig;
