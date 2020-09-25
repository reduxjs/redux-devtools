import * as path from 'path';
import * as webpack from 'webpack';

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loaders: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },
  devtool: 'eval-source-map',
};
