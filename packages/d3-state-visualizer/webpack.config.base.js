'use strict';

module.exports = {
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },
  output: {
    library: 'd3-state-visualizer',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js'],
  },
};
