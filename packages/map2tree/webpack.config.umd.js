const path = require('path');

module.exports = (env = {}) => ({
  mode: 'production',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    library: 'd3tooltip',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: env.minimize ? 'map2tree.min.js' : 'map2tree.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: !!env.minimize
  },
  performance: {
    hints: false
  }
});
