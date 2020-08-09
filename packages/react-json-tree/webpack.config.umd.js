const path = require('path');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    library: 'ReactJsonTree',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'umd'),
    filename: env.production ? 'react-json-tree.min.js' : 'react-json-tree.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
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
