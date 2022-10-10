import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const baseConfig = (params) => ({
  // devtool: 'source-map',
  mode: params.mode,
  entry: params.input || {
    background: ['../src/chromeApiMock', '../src/background/index'],
    options: ['../src/chromeApiMock', '../src/options/index'],
    window: ['../src/window/index'],
    remote: ['../src/remote/index'],
    devpanel: ['../src/chromeApiMock', '../src/devpanel/index'],
    devtools: ['../src/devtools/index'],
    content: ['../src/chromeApiMock', '../src/contentScript/index'],
    pagewrap: ['../src/pageScriptWrap'],
    ...params.inputExtra,
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    ...params.output,
  },
  plugins: [
    new webpack.DefinePlugin(params.globals),
    ...(params.plugins
      ? params.plugins
      : [
          new ForkTsCheckerWebpackPlugin({
            typescript: {
              configFile: 'tsconfig.json',
            },
          }),
        ]),
  ].concat(
    params.copy
      ? new CopyPlugin({
          patterns: [
            {
              from: params.manifestJsonPath,
              to: path.join(params.output.path, 'manifest.json'),
            },
            {
              from: path.join(__dirname, '../src/assets/'),
              to: params.output.path,
            },
          ],
        })
      : []
  ),
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      app: path.join(__dirname, '../src/app'),
      tmp: path.join(__dirname, '../build/tmp'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  module: {
    rules: [
      ...(params.loaders
        ? params.loaders
        : [
            {
              test: /\.(js|ts)x?$/,
              use: 'babel-loader',
              exclude: /(node_modules|tmp\/page\.bundle)/,
            },
          ]),
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
});

export default baseConfig;
