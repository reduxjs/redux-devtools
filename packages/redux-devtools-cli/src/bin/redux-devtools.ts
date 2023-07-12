#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import chalk from 'chalk';
import * as injectServer from './injectServer.js';
import getOptions from '../options.js';
import server from '../index.js';
import openApp from './openApp.js';

const argv = parseArgs(process.argv.slice(2));

const options = getOptions(argv);

function readFile(filePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

if (argv.protocol === 'https') {
  argv.key = argv.key ? readFile(argv.key as string) : null;
  argv.cert = argv.cert ? readFile(argv.cert as string) : null;
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
          '` not found.'),
  );

  process.exit(pass ? 0 : 1);
}

if (argv.revert) {
  injectRN(
    argv.revert as string,
    'Revert injection of ReduxDevTools server from React Native local server',
  );
}
if (argv.injectserver) {
  injectRN(
    argv.injectserver as string,
    'Inject ReduxDevTools server into React Native local server',
  );
}

const response = await server(argv);
if (argv.open && argv.open !== 'false') {
  await response.ready;
  await openApp(argv.open as string, options);
}
