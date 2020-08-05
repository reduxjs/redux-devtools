// NOTE: This config is used for deploy to gh-pages
const webpack = require('webpack');
const devConfig = require('./webpack.config');

devConfig.entry = './index';
devConfig.plugins = [new webpack.NoEmitOnErrorsPlugin()];

module.exports = devConfig;
