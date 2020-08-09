const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    hot: true,
  },
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: [__dirname, path.join(__dirname, '../../src')],
      },
      {
        test: /\.css?$/,
        use: [
          'style-loader',
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
