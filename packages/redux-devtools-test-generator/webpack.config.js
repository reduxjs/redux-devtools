const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExportFilesWebpackPlugin = require('export-files-webpack-plugin');
const NyanProgressWebpackPlugin = require('nyan-progress-webpack-plugin');

const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'eval',
  entry: isProduction ?
    ['./demo/src/js/index'] :
    [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './demo/src/js/index'
    ],
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'js/bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(isProduction ? ['demo/dist'] : []),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      filename: 'index.html',
      package: pkg
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    }),
    new NyanProgressWebpackPlugin()
  ].concat(isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    })
  ] : [
    new ExportFilesWebpackPlugin('demo/dist/index.html'),
    new webpack.HotModuleReplacementPlugin()
  ]),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo/src/js')
      ]
    },
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ]
    },
    {
      test: /\.(ttf|eot|svg|woff|woff2)$/,
      loader: 'file-loader',
      options: { outputPath: 'fonts/', publicPath: 'fonts/' }
    }
    ]
  },
  devServer: isProduction ? null : {
    quiet: false,
    port: 3001,
    hot: true,
    stats: {
      chunkModules: false,
      colors: true
    },
    historyApiFallback: true
  }
};
