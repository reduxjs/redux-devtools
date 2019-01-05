var opn = require('opn');

function open(app, options) {
  console.log('app', app)
  opn('http://localhost:' + options.port + '/', app !== 'browser' && app !== true ? { app: app } : undefined);
}

module.exports = open;
