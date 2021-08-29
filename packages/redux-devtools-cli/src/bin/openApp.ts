import open from 'open';
import path from 'path';
import spawn from 'cross-spawn';
import { Options } from '../options';

export default async function openApp(app: true | string, options: Options) {
  if (app === true || app === 'electron') {
    try {
      const port = options.port ? `--port=${options.port}` : '';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      spawn.sync(require('electron'), [
        path.join(__dirname, '..', '..', 'app'),
        port,
      ]);
    } catch (error) {
      /* eslint-disable no-console */
      if (error.message === "Cannot find module 'electron'") {
        // TODO: Move electron to dev-dependences to make our package installation faster when not needed.
        console.log(
          '   \x1b[1;31m[Warn]\x1b[0m Electron module not installed.\n'
        );
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

  await open(
    `http://localhost:${options.port}/`,
    app !== 'browser' ? { app: { name: app } } : undefined
  );
}
