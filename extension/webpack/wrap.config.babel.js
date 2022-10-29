import path from 'path';
import baseConfig from './base.config';

export default baseConfig({
  mode: 'production',
  input: {
    page: [path.join(__dirname, '../src/pageScript')],
  },
  output: { path: path.join(__dirname, '../build/tmp') },
  globals: {
    'process.env': {
      NODE_ENV: '"production"',
    },
  },
});
