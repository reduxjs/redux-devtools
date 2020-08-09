const path = require('path');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    library: 'd3tooltip',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: env.production ? 'd3tooltip.min.js' : 'd3tooltip.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
});
