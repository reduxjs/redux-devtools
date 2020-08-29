import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'eval-source-map',
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      package: pkg,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ].concat(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'demo/src/js'),
        ],
      },
    ],
  },
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
};
