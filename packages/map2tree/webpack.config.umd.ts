import * as path from 'path';
import * as webpack from 'webpack';

export default (env: { production?: boolean } = {}): webpack.Configuration => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index'],
  },
  output: {
    library: 'map2tree',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: env.production ? 'map2tree.min.js' : 'map2tree.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
