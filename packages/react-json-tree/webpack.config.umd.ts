import * as path from 'path';
import * as webpack from 'webpack';

export default (env: { production?: boolean } = {}): webpack.Configuration => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index'],
  },
  output: {
    library: 'ReactJsonTree',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'umd'),
    filename: env.production ? 'react-json-tree.min.js' : 'react-json-tree.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
});
