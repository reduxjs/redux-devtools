import getPort from 'getport';
import SocketCluster from 'socketcluster';
import getOptions, { Options } from './options';

// var LOG_LEVEL_NONE = 0;
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_INFO = 3;

export interface ExtendedOptions extends Options {
  workerController: string;
  allowClientPublish: boolean;
}

export default function (argv: { [arg: string]: any }): Promise<{
  portAlreadyUsed?: boolean;
  on: (status: 'ready', cb: (() => void) | (() => Promise<void>)) => void;
}> {
  const options = Object.assign(getOptions(argv), {
    workerController: __dirname + '/worker.js',
    allowClientPublish: false,
  });
  const port = options.port;
  const logLevel =
    options.logLevel === undefined ? LOG_LEVEL_INFO : options.logLevel;
  return new Promise(function (resolve) {
    // Check port already used
    getPort(port, function (err, p) {
      /* eslint-disable no-console */
      if (err) {
        if (logLevel >= LOG_LEVEL_ERROR) {
          console.error(err);
        }
        return;
      }
      if (port !== p) {
        if (logLevel >= LOG_LEVEL_WARN) {
          console.log(`[ReduxDevTools] Server port ${port} is already used.`);
        }
        resolve({
          portAlreadyUsed: true,
          on: function (status: string, cb: () => void) {
            cb();
          },
        });
      } else {
        if (logLevel >= LOG_LEVEL_INFO) {
          console.log('[ReduxDevTools] Start server...');
          console.log('-'.repeat(80) + '\n');
        }
        resolve(new SocketCluster(options));
      }
      /* eslint-enable no-console */
    });
  });
}
