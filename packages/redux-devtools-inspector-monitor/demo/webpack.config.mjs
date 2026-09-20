import * as path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import pkg from '@redux-devtools/inspector-monitor/package.json' with { type: 'json' };

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      package: pkg,
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(import.meta.dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};

export default config;
