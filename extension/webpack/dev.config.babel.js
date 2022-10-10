import path from 'path';
import webpack from 'webpack';
import baseConfig from './base.config';

let config = baseConfig({
  mode: 'development',
  inputExtra: {
    page: [path.join(__dirname, '../src/pageScript')],
  },
  output: { path: path.join(__dirname, '../dev') },
  globals: {
    'process.env': {
      NODE_ENV: '"development"',
    },
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
  copy: true,
  manifestJsonPath: path.join(__dirname, '../chrome/manifest.json'),
});

config.watch = true;

export default config;
