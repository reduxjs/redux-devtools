const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => (
  {
    entry: {
      app: './src/index.js',
      common: [
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'redux-persist',
        'localforage',
        'styled-components',
        'jsan',
        'socketcluster-client'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'build/' + env.platform),
      publicPath: '',
      filename: 'js/[name].js',
      sourceMapFilename: 'js/[name].map'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        {
          test: /\.(png|gif|jpg)$/,
          loader: 'url-loader',
          options: { limit: '25000', outputPath: 'images/', publicPath: 'images/' }
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)$/,
          loader: 'file-loader',
          options: { outputPath: 'fonts/', publicPath: 'fonts/' }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.development ? 'development' : 'production'),
          PLATFORM: JSON.stringify(env.platform)
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['common'],
      }),
      new HtmlWebpackPlugin({
        template: 'assets/index.html'
      }),
      new CopyWebpackPlugin(
        env.platform === 'electron' ? [
          { context: './src/electron', from: '*' }
        ] : []
      )
    ],
    devServer: {
      port: 3000
    },
    devtool: env.development ? 'eval' : 'source-map'
  }
);
