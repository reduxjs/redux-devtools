import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
};

export default config;
