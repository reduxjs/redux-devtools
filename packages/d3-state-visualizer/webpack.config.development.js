'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = Object.assign({}, baseConfig);
config.mode = 'development';
config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
];

module.exports = config;
