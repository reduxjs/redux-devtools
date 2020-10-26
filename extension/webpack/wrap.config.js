import path from 'path';
import baseConfig from './base.config';

export default baseConfig({
  input: { page: [ path.join(__dirname, '../src/browser/extension/inject/pageScript') ] },
  output: { path: path.join(__dirname, '../build/tmp') },
  globals: {
    'process.env': {
      NODE_ENV: '"production"'
    }
  }
});
