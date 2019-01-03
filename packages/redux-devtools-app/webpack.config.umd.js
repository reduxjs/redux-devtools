const path = require('path');
const webpack = require('webpack');

module.exports = (env = {}) => (
  {
    entry: {
      app: ['./src/app/index.js']
    },
    output: {
      library: 'RemoteDevApp',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      filename: env.development ? 'remotedev-app.js' : 'remotedev-app.min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        {
          test: /\.(png|gif|jpg)$/,
          loader: 'url-loader',
          options: { limit: '25000' }
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          PLATFORM: JSON.stringify('web')
        }
      })
    ],
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
    }
  }
);
