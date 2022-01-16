import * as path from 'path';
import * as webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default (env: { production?: boolean } = {}): webpack.Configuration => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index'],
  },
  output: {
    library: 'ReduxDevToolsApp',
    libraryExport: 'Root',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'umd'),
    filename: env.production
      ? 'redux-devtools-app.min.js'
      : 'redux-devtools-app.js',
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
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PLATFORM: JSON.stringify('web'),
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: 'tsconfig.json',
      },
    }),
  ],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
});
