#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import chalk from 'chalk';
import * as injectServer from './injectServer';
import getOptions from '../options';
import server from '../index';
import openApp from './openApp';

const argv = parseArgs(process.argv.slice(2));

const options = getOptions(argv);

function readFile(filePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

if (argv.protocol === 'https') {
  argv.key = argv.key ? readFile(argv.key) : null;
  argv.cert = argv.cert ? readFile(argv.cert) : null;
}

function log(pass: boolean, msg: string) {
  const prefix = pass ? chalk.green.bgBlack('PASS') : chalk.red.bgBlack('FAIL');
  const color = pass ? chalk.blue : chalk.red;
  console.log(prefix, color(msg)); // eslint-disable-line no-console
}

function getModuleName(type: string) {
  switch (type) {
    case 'macos':
      return 'react-native-macos';
    // react-native-macos is renamed from react-native-desktop
    case 'desktop':
      return 'react-native-desktop';
    case 'reactnative':
    default:
      return 'react-native';
  }
}

function getModulePath(moduleName: string) {
  return path.join(process.cwd(), 'node_modules', moduleName);
}

function getModule(type: string) {
  let moduleName = getModuleName(type);
  let modulePath = getModulePath(moduleName);
  if (type === 'desktop' && !fs.existsSync(modulePath)) {
    moduleName = getModuleName('macos');
    modulePath = getModulePath(moduleName);
  }
  return {
    name: moduleName,
    path: modulePath,
  };
}

function injectRN(type: string, msg: string) {
  const module = getModule(type);
  const fn = type === 'revert' ? injectServer.revert : injectServer.inject;
  const pass = fn(module.path, options, module.name);
  log(
    pass,
    msg +
      (pass
        ? '.'
        : ', the file `' +
          path.join(module.name, injectServer.fullPath) +
          '` not found.')
  );

  process.exit(pass ? 0 : 1);
}

if (argv.revert) {
  injectRN(
    argv.revert,
    'Revert injection of ReduxDevTools server from React Native local server'
  );
}
if (argv.injectserver) {
  injectRN(
    argv.injectserver,
    'Inject ReduxDevTools server into React Native local server'
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server(argv).then(function (r) {
  if (argv.open && argv.open !== 'false') {
    r.on('ready', async function () {
      await openApp(argv.open, options);
    });
  }
});
