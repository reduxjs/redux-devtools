var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  devServer: {
    port: 4004
  }
};
