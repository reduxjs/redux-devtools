import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default (
  env: { development?: boolean; platform?: string } = {},
): webpack.Configuration => ({
  mode: env.development ? 'development' : 'production',
  entry: {
    app: './demo/index',
  },
  output: {
    path: path.resolve(__dirname, `build/${env.platform as string}`),
    publicPath: '',
    filename: 'js/[name].js',
    sourceMapFilename: 'js/[name].map',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.woff2$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(
          env.development ? 'development' : 'production',
        ),
        PLATFORM: JSON.stringify(env.platform),
      },
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'tsconfig.demo.json',
      },
    }),
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: false,
  },
  devServer: {
    port: 3000,
  },
  devtool: env.development ? 'eval-source-map' : 'source-map',
});
