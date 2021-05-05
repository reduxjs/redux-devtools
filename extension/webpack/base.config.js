import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

const extpath = path.join(__dirname, '../src/browser/extension/');
const mock = `${extpath}chromeAPIMock.js`;

const baseConfig = (params) => ({
  // devtool: 'source-map',
  mode: 'production',
  entry: params.input || {
    background: [mock, `${extpath}background/index`],
    options: [mock, `${extpath}options/index`],
    window: [`${extpath}window/index`],
    remote: [`${extpath}window/remote`],
    devpanel: [mock, `${extpath}devpanel/index`],
    devtools: [`${extpath}devtools/index`],
    content: [mock, `${extpath}inject/contentScript`],
    pagewrap: [`${extpath}inject/pageScriptWrap`],
    'redux-devtools-extension': [
      `${extpath}inject/index`,
      `${extpath}inject/deprecatedWarn`,
    ],
    inject: [`${extpath}inject/index`, `${extpath}inject/deprecatedWarn`],
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
          new webpack.optimize.ModuleConcatenationPlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
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
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      app: path.join(__dirname, '../src/app'),
      tmp: path.join(__dirname, '../build/tmp'),
    },
    extensions: ['.js'],
  },
  module: {
    rules: [
      ...(params.loaders
        ? params.loaders
        : [
            {
              test: /\.js$/,
              use: 'babel-loader',
              exclude: /(node_modules|tmp\/page\.bundle)/,
            },
          ]),
      {
        test: /\.css?$/,
        use: ['style-loader', 'raw-loader'],
      },
      {
        test: /\.pug$/,
        use: ['file-loader?name=[name].html', 'pug-html-loader'],
      },
    ],
  },
});

export default baseConfig;
