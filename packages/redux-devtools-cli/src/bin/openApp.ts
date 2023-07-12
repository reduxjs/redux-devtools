import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import spawn from 'cross-spawn';
import type { Options } from '../options.js';

const require = createRequire(import.meta.url);

export default async function openApp(app: true | string, options: Options) {
  if (app === true || app === 'electron') {
    try {
      const port = options.port ? `--port=${options.port}` : '';
      const host = options.host ? `--host=${options.host}` : '';
      const protocol = options.protocol ? `--protocol=${options.protocol}` : '';

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      spawn(require('electron') as string, [
        path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          '..',
          '..',
          'app',
        ),
        port,
        host,
        protocol,
      ]);
    } catch (error) {
      /* eslint-disable no-console */
      if ((error as Error).message === "Cannot find module 'electron'") {
        // TODO: Move electron to dev-dependences to make our package installation faster when not needed.
        console.log(
          '   \x1b[1;31m[Warn]\x1b[0m Electron module not installed.\n',
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
    `${options.protocol}://${options.host ?? 'localhost'}:${options.port}/`,
    app !== 'browser' ? { app: { name: app } } : undefined,
  );
}
