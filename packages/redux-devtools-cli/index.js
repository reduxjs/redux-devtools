var getPort = require('getport');
var SocketCluster = require('socketcluster');
var getOptions = require('./src/options');

var LOG_LEVEL_NONE = 0;
var LOG_LEVEL_ERROR = 1;
var LOG_LEVEL_WARN = 2;
var LOG_LEVEL_INFO = 3;

module.exports = function(argv) {
  var options = Object.assign(getOptions(argv), {
    workerController: __dirname + '/src/worker.js',
    allowClientPublish: false
  });
  var port = options.port;
  var logLevel = options.logLevel === undefined ? LOG_LEVEL_INFO : options.logLevel;
  return new Promise(function(resolve) {
    // Check port already used
    getPort(port, function(err, p) {
      if (err) {
        if (logLevel >= LOG_LEVEL_ERROR) {
          console.error(err);
        }
        return;
      }
      if (port !== p) {
        if (logLevel >= LOG_LEVEL_WARN) {
          console.log('[ReduxDevTools] Server port ' + port + ' is already used.');
        }
        resolve({ portAlreadyUsed: true, on: function(status, cb) { cb(); } });
      } else {
        if (logLevel >= LOG_LEVEL_INFO) {
          console.log('[ReduxDevTools] Start server...');
          console.log('-'.repeat(80) + '\n');
        }
        resolve(new SocketCluster(options));
      }
    });
  });
};
