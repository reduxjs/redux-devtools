const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}) => (
  {
    mode: 'production',
    entry: {
      app: ['./src/index.js']
    },
    output: {
      library: 'ReactJsonTree',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'umd'),
      filename: env.minimize ? 'react-json-tree.min.js' : 'react-json-tree.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
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
  }
);
