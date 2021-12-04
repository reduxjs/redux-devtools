import * as path from 'path';
import * as webpack from 'webpack';

export default (env: { production?: boolean } = {}): webpack.Configuration => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index'],
  },
  output: {
    library: 'd3-state-visualizer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: env.production
      ? 'd3-state-visualizer.min.js'
      : 'd3-state-visualizer.js',
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
