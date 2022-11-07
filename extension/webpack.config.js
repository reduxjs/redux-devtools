const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function (env) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval-source-map',
    entry: {
      background: [
        path.resolve(__dirname, 'src/chromeApiMock'),
        path.resolve(__dirname, 'src/background/index'),
      ],
      options: [
        path.resolve(__dirname, 'src/chromeApiMock'),
        path.resolve(__dirname, 'src/options/index'),
      ],
      window: [path.resolve(__dirname, 'src/window/index')],
      remote: [path.resolve(__dirname, 'src/remote/index')],
      devpanel: [
        path.resolve(__dirname, 'src/chromeApiMock'),
        path.resolve(__dirname, 'src/devpanel/index'),
      ],
      devtools: path.resolve(__dirname, 'src/devtools/index'),
      content: [
        path.resolve(__dirname, 'src/chromeApiMock'),
        path.resolve(__dirname, 'src/contentScript/index'),
      ],
      page: path.join(__dirname, 'src/pageScript'),
      ...(env.production
        ? {}
        : { pagewrap: path.resolve(__dirname, 'src/pageScriptWrap') }),
    },
    output: {
      filename: '[name].bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BABEL_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: 'tsconfig.json',
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'chrome/manifest.json'),
            to: path.join(__dirname, 'dist/manifest.json'),
          },
          {
            from: path.join(__dirname, 'src/assets'),
            to: path.join(__dirname, 'dist'),
          },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css?$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.pug$/,
          use: ['file-loader?name=[name].html', 'pug-html-loader'],
        },
      ],
    },
  };
};
