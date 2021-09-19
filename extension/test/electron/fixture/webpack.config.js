const path = require('path');

module.exports = {
  mode: 'development',
  entry: './test/electron/fixture/src/renderer.js',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
