const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}) => ({
  mode: 'production',
  entry: {
    app: ['./src/index']
  },
  output: {
    library: 'ReactJsonTree',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'umd'),
    filename: env.minimize ? 'react-json-tree.min.js' : 'react-json-tree.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
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
    }
  },
  optimization: {
    minimize: !!env.minimize,
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
