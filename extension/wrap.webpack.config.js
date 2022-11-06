const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    pagewrap: path.resolve(__dirname, 'src/pageScriptWrap'),
  },
  output: {
    filename: '[name].bundle.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'tsconfig.json',
      },
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
        exclude: /(node_modules|dist\/page\.bundle)/,
      },
    ],
  },
};
