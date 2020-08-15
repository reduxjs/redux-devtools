var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: 'eval',
  entry: isProduction
    ? ['./demo/src/index']
    : [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './demo/src/index',
      ],
  output: {
    path: path.join(__dirname, 'demo/static'),
    filename: 'bundle.js',
    publicPath: isProduction ? 'static/' : '/static/',
  },
  plugins: isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'demo/src'),
        ],
      },
    ],
  },
  devServer: isProduction
    ? null
    : {
        quiet: true,
        publicPath: '/static/',
        port: 3000,
        contentBase: './demo/',
        hot: true,
        stats: {
          colors: true,
        },
        historyApiFallback: true,
      },
};
