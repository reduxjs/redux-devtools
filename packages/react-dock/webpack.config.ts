import * as path from 'path';
import * as webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
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
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'demo/src'),
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  devServer: isProduction
    ? null
    : {
        publicPath: '/static/',
        port: 3000,
        contentBase: './demo/',
        hot: true,
        stats: {
          colors: true,
        },
        historyApiFallback: true,
      },
  devtool: 'eval-source-map',
};
