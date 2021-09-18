import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import pkg from '../../package.json';

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
          path.join(__dirname, '../../src'),
          path.join(__dirname, '../src/js'),
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      package: pkg,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'demo/tsconfig.json',
      },
    }),
    ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
  ],
  devServer: isProduction
    ? {}
    : {
        port: 3000,
        hot: true,
        historyApiFallback: true,
      },
  devtool: 'eval-source-map',
};
