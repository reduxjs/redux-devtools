var fs = require('fs');
var path = require('path');
var semver = require('semver');

var name = 'remotedev-server';
var startFlag = '/* ' + name + ' start */';
var endFlag = '/* ' + name + ' end */';
var serverFlags = {
  'react-native': {
    '0.0.1': '    _server(argv, config, resolve, reject);',
    '0.31.0': "  runServer(args, config, () => console.log('\\nReact packager ready.\\n'));",
    '0.44.0-rc.0': '  runServer(args, config, startedCallback, readyCallback);',
    '0.46.0-rc.0': '  runServer(runServerArgs, configT, startedCallback, readyCallback);',
    '0.57.0': '  runServer(args, configT);'
  },
  'react-native-desktop': {
    '0.0.1': '    _server(argv, config, resolve, reject);'
  }
};

function getModuleVersion(modulePath) {
  return JSON.parse(
    fs.readFileSync(
      path.join(modulePath, 'package.json'),
      'utf-8'
    )
  ).version;
}

function getServerFlag(moduleName, version) {
  var flags = serverFlags[moduleName || 'react-native'];
  var versions = Object.keys(flags);
  var flag;
  for (var i = 0; i < versions.length; i++) {
    if (semver.gte(version, versions[i])) {
      flag = flags[versions[i]];
    }
  }
  return flag;
}

exports.dir = 'local-cli/server';
exports.file = 'server.js';
exports.fullPath = path.join(exports.dir, exports.file);

exports.inject = function(modulePath, options, moduleName) {
  var filePath = path.join(modulePath, exports.fullPath);
  if (!fs.existsSync(filePath)) return false;

  var serverFlag = getServerFlag(
    moduleName,
    getModuleVersion(modulePath)
  );
  var code = [
    startFlag,
    '    require("' + name + '")(' + JSON.stringify(options) + ')',
    '      .then(_remotedev =>',
    '        _remotedev.on("ready", () => {',
    '          if (!_remotedev.portAlreadyUsed) console.log("-".repeat(80));',
    '      ' + serverFlag,
    '        })',
    '      );',
    endFlag,
  ].join('\n');

  var serverCode = fs.readFileSync(filePath, 'utf-8');
  var start = serverCode.indexOf(startFlag);  // already injected ?
  var end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start === -1) {
    start = serverCode.indexOf(serverFlag);
    end = start + serverFlag.length;
  }
  fs.writeFileSync(
    filePath,
    serverCode.substr(0, start) + code + serverCode.substr(end, serverCode.length)
  );
  return true;
};

exports.revert = function(modulePath, moduleName) {
  var filePath = path.join(modulePath, exports.fullPath);
  if (!fs.existsSync(filePath)) return false;

  var serverFlag = getServerFlag(
    moduleName,
    getModuleVersion(modulePath)
  );
  var serverCode = fs.readFileSync(filePath, 'utf-8');
  var start = serverCode.indexOf(startFlag); // already injected ?
  var end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) + serverFlag + serverCode.substr(end, serverCode.length)
    );
  }
  return true;
};
