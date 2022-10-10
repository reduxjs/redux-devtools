import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const baseConfig = (params) => ({
  // devtool: 'source-map',
  mode: params.mode,
  entry: params.input || {
    background: [
      path.resolve(__dirname, '../src/chromeApiMock'),
      path.resolve(__dirname, '../src/background/index'),
    ],
    options: [
      path.resolve(__dirname, '../src/chromeApiMock'),
      path.resolve(__dirname, '../src/options/index'),
    ],
    window: [path.resolve(__dirname, '../src/window/index')],
    remote: [path.resolve(__dirname, '../src/remote/index')],
    devpanel: [
      path.resolve(__dirname, '../src/chromeApiMock'),
      path.resolve(__dirname, '../src/devpanel/index'),
    ],
    devtools: [path.resolve(__dirname, '../src/devtools/index')],
    content: [
      path.resolve(__dirname, '../src/chromeApiMock'),
      path.resolve(__dirname, '../src/contentScript/index'),
    ],
    pagewrap: [path.resolve(__dirname, '../src/pageScriptWrap')],
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
