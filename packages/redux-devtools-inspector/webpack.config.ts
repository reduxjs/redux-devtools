import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: isProduction
    ? ['./demo/src/js/index']
    : [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './demo/src/js/index',
      ],
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'demo/src/js'),
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      package: pkg,
    }),
  ].concat(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
  devServer: isProduction
    ? {}
    : {
        quiet: false,
        port: 3000,
        hot: true,
        stats: {
          chunkModules: false,
          colors: true,
        },
        historyApiFallback: true,
      },
  devtool: 'eval-source-map',
};
