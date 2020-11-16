import path from 'path';
import baseConfig from './base.config';

export default baseConfig({
  output: { path: path.join(__dirname, '../build/extension') },
  globals: {
    'process.env': {
      NODE_ENV: '"production"',
    },
  },
});
