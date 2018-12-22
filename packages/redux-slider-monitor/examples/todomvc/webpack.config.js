const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    hot: true
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
  resolve: {
    alias: {
      'redux-slider-monitor': path.join(__dirname, '..', '..', 'src/SliderMonitor')
    },
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: [__dirname, path.join(__dirname, '../../src')]
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'raw-loader'],
        include: [
          __dirname,
          path.join(__dirname, '../../../../node_modules/todomvc-app-css')
        ]
      }
    ]
  }
};
