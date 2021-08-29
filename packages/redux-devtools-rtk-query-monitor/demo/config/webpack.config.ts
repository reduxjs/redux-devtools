import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as pkg from '../../package.json';
const isProduction = process.env.NODE_ENV === 'production';

const demoSrc = path.join(__dirname, '../src');
const libSrc = path.join(__dirname, '../../src');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: isProduction
    ? ['./demo/src/index']
    : [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './demo/src/index',
      ],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [demoSrc, libSrc],
      },
      {
        test: /\.css?$/,
        loaders: ['style-loader', 'css-loader'],
        include: demoSrc,
      },
    ],
  },
  resolve: {
    modules: ['node_modules', demoSrc],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    minimize: isProduction,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/public/index.html',
      package: pkg,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'demo/public/assets/*.js',
          to: ({ absoluteFilename }) => {
            return `./${path.basename(absoluteFilename)}`;
          },
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'demo/tsconfig.json',
      },
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
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
};
