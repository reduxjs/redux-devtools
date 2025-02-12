import fs from 'fs';

interface ProtocolOptions {
  key: string | undefined;
  cert: string | undefined;
  passphrase: string | undefined;
}

interface DbOptions {
  client: string;
  connection: {
    filename: string;
  };
  useNullAsDefault: boolean;
  debug: boolean;
  migrate: boolean;
}

export interface Options {
  host: string | undefined;
  port: number;
  protocol: 'http' | 'https';
  protocolOptions: ProtocolOptions | undefined;
  dbOptions: DbOptions;
  maxRequestBody: string;
  logHTTPRequests?: boolean;
  pingTimeout: number;
  logLevel: 0 | 1 | 3 | 2;
  wsEngine: string;
}

export default function getOptions(argv: { [arg: string]: any }): Options {
  let dbOptions = argv.dbOptions;
  if (typeof dbOptions === 'string') {
    dbOptions = JSON.parse(fs.readFileSync(dbOptions, 'utf8'));
  } else if (typeof dbOptions === 'undefined') {
    dbOptions = JSON.parse(
      fs.readFileSync(
        new URL('../defaultDbOptions.json', import.meta.url),
        'utf8',
      ),
    );
  }

  return {
    host:
      argv.hostname || process.env.npm_package_remotedev_hostname || undefined,
    port: Number(argv.port || process.env.npm_package_remotedev_port) || 8000,
    protocol:
      argv.protocol || process.env.npm_package_remotedev_protocol || 'http',
    protocolOptions: !(argv.protocol === 'https')
      ? undefined
      : {
          key: argv.key || process.env.npm_package_remotedev_key || undefined,
          cert:
            argv.cert || process.env.npm_package_remotedev_cert || undefined,
          passphrase:
            argv.passphrase ||
            process.env.npm_package_remotedev_passphrase ||
            undefined,
        },
    dbOptions: dbOptions,
    maxRequestBody: argv.maxRequestBody || '16mb',
    logHTTPRequests: argv.logHTTPRequests,
    logLevel: argv.logLevel || 3,
    pingTimeout: argv.pingTimeout || 20000,
    wsEngine:
      argv.wsEngine || process.env.npm_package_remotedev_wsengine || 'ws',
  };
}
