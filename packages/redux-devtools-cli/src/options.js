var path = require('path');

module.exports = function getOptions(argv) {
  var dbOptions = argv.dbOptions;
  if (typeof dbOptions === 'string') {
    dbOptions = require(path.resolve(process.cwd(), argv.dbOptions));
  } else if (typeof dbOptions === 'undefined') {
    dbOptions = require('../defaultDbOptions.json');
  }

  return {
    host: argv.hostname || process.env.npm_package_remotedev_hostname || null,
    port: Number(argv.port || process.env.npm_package_remotedev_port) || 8000,
    protocol: argv.protocol || process.env.npm_package_remotedev_protocol || 'http',
    protocolOptions: !(argv.protocol === 'https') ? null : {
      key: argv.key || process.env.npm_package_remotedev_key || null,
      cert: argv.cert || process.env.npm_package_remotedev_cert || null,
      passphrase: argv.passphrase || process.env.npm_package_remotedev_passphrase || null
    },
    dbOptions: dbOptions,
    maxRequestBody: argv.passphrase || '16mb',
    logHTTPRequests: argv.logHTTPRequests,
    logLevel: argv.logLevel || 3,
    wsEngine: argv.wsEngine || process.env.npm_package_remotedev_wsengine || 'ws'
  };
}
