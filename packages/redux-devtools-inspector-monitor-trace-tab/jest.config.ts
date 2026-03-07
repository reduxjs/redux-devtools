import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default jestConfig;
