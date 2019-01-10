var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'source-map',
  entry: [
    !isProduction && 'webpack-dev-server/client?http://localhost:3000',
    !isProduction && 'webpack/hot/only-dev-server',
    './src/index'
  ].filter(Boolean),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    isProduction &&
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: true
      })
  ].filter(Boolean),
  resolve: {
    alias: {
      'react-json-tree/lib': path.join(__dirname, '..', 'src'),
      'react-json-tree': path.join(__dirname, '..', 'src'),
      react: path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'].filter(Boolean),
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'].filter(Boolean),
        include: path.join(__dirname, '..', 'src')
      }
    ]
  }
};
