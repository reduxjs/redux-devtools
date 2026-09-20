import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(packageName: string) {
  return dirname(
    fileURLToPath(import.meta.resolve(`${packageName}/package.json`)),
  );
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-onboarding')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  staticDirs: ['../fonts'],
};
export default config;
