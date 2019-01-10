var opn = require('opn');
var path = require('path');
var spawn = require('cross-spawn');

function open(app, options) {
  if (app === true || app === 'electron') {
    try {
      spawn.sync(
        require('electron'),
        [path.join(__dirname, '..', 'app')]
      );  
    } catch (error) {
       /* eslint-disable no-console */
      if (error.message === 'Cannot find module \'electron\'') {
        // TODO: Move electron to dev-dependences to make our package installation faster when not needed.
        console.log('   \x1b[1;31m[Warn]\x1b[0m Electron module not installed.\n');
        /*
        We will use "npm" to install Electron via "npm install -D".
        Do you want to install 'electron' (yes/no): yes
        Installing 'electron' (running 'npm install -D webpack-cli')...
        */
      } else {
        console.log(error);
      }
       /* eslint-enable no-console */
    }
    return;
  }
  opn('http://localhost:' + options.port + '/', app !== 'browser' ? { app: app } : undefined);
}

module.exports = open;
