const path = require('path');
const updateConfig = require('./user/modify_webpack_config');

const config = {
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [{ loader: 'style-loader' }, { loader: 'raw-loader' }],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.json?$/,
        loader: 'json-loader',
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.woff2?(\?\S*)?$/,
        loader: 'url?limit=65000&mimetype=application/font-woff'
      }
    ]
  }
};

updateConfig(config);
module.exports = config;
