var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
}).listen(3000, 'localhost', function (err) {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  // eslint-disable-next-line no-console
  console.log('Listening at localhost:3000');
});
