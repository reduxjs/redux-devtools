var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['webpack-hot-middleware/client', './index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname,
      },
    ],
  },
};

var src = path.join(__dirname, '..', '..', 'src');
var nodeModules = path.join(__dirname, '..', '..', 'node_modules');
var fs = require('fs');
if (fs.existsSync(src) && fs.existsSync(nodeModules)) {
  // Resolve to source
  module.exports.resolve = { alias: { 'remote-redux-devtools': src } };
  // Compile from source
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: src,
  });
}
