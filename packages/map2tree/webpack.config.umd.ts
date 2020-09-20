import * as path from 'path';

module.exports = (env: { production?: boolean } = {}) => ({
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
