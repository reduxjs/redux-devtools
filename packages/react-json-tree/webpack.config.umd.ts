import * as path from 'path';
import * as webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

function isMinimizeSet(
  env: string | Record<string, boolean | number | string>
) {
  return (env as { minimize: boolean }).minimize;
}

const config: webpack.ConfigurationFactory = (env = {}) => ({
  mode: 'production',
  entry: './src/index',
  output: {
    library: 'ReactJsonTree',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'umd'),
    filename: isMinimizeSet(env)
      ? 'react-json-tree.min.js'
      : 'react-json-tree.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  optimization: {
    minimize: isMinimizeSet(env),
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  },
  performance: {
    hints: false
  }
});

export default config;
