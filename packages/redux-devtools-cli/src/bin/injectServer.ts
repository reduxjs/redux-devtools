import fs from 'fs';
import path from 'path';
import semver from 'semver';
import type { Options } from '../options.js';

const name = '@redux-devtools/cli';
const startFlag = '/* ' + name + ' start */';
const endFlag = '/* ' + name + ' end */';
const serverFlags: { [moduleName: string]: { [version: string]: string } } = {
  'react-native': {
    '0.0.1': '    _server(argv, config, resolve, reject);',
    '0.31.0':
      "  runServer(args, config, () => console.log('\\nReact packager ready.\\n'));",
    '0.44.0-rc.0': '  runServer(args, config, startedCallback, readyCallback);',
    '0.46.0-rc.0':
      '  runServer(runServerArgs, configT, startedCallback, readyCallback);',
    '0.57.0': '  runServer(args, configT);',
  },
  'react-native-desktop': {
    '0.0.1': '    _server(argv, config, resolve, reject);',
  },
};

function getModuleVersion(modulePath: string): string {
  return JSON.parse(
    fs.readFileSync(path.join(modulePath, 'package.json'), 'utf-8'),
  ).version;
}

function getServerFlag(moduleName: string, version: string): string {
  const flags = serverFlags[moduleName || 'react-native'];
  const versions = Object.keys(flags);
  let flag;
  for (let i = 0; i < versions.length; i++) {
    if (semver.gte(version, versions[i])) {
      flag = flags[versions[i]];
    }
  }
  return flag as string;
}

export const dir = 'local-cli/server';
export const file = 'server.js';
export const fullPath = path.join(dir, file);

export function inject(
  modulePath: string,
  options: Options,
  moduleName: string,
) {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const serverFlag = getServerFlag(moduleName, getModuleVersion(modulePath));
  const code = [
    startFlag,
    '    require("' + name + '")(' + JSON.stringify(options) + ')',
    '      .then(_remotedev =>',
    '        _remotedev.ready.then(() => {',
    '          if (!_remotedev.portAlreadyUsed) console.log("-".repeat(80));',
    '      ' + serverFlag,
    '        })',
    '      );',
    endFlag,
  ].join('\n');

  const serverCode = fs.readFileSync(filePath, 'utf-8');
  let start = serverCode.indexOf(startFlag); // already injected ?
  let end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start === -1) {
    start = serverCode.indexOf(serverFlag);
    end = start + serverFlag.length;
  }
  fs.writeFileSync(
    filePath,
    serverCode.substr(0, start) +
      code +
      serverCode.substr(end, serverCode.length),
  );
  return true;
}

export function revert(
  modulePath: string,
  options: Options,
  moduleName: string,
) {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const serverFlag = getServerFlag(moduleName, getModuleVersion(modulePath));
  const serverCode = fs.readFileSync(filePath, 'utf-8');
  const start = serverCode.indexOf(startFlag); // already injected ?
  const end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) +
        serverFlag +
        serverCode.substr(end, serverCode.length),
    );
  }
  return true;
}
