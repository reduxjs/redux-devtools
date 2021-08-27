import path from 'path';
import baseConfig from './base.config';

const config = baseConfig({
  mode: 'production',
  output: { path: path.join(__dirname, '../build/extension') },
  globals: {
    'process.env': {
      NODE_ENV: '"production"',
    },
  },
  copy: true,
  manifestJsonPath: path.join(
    __dirname,
    '../src/browser/firefox/manifest.json'
  ),
});

export default config;
