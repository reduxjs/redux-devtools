import http from 'http';
import https from 'https';

export const createServer = (argv: { [arg: string]: unknown }): http.Server | https.Server => {
  const typedArgv = argv as {
    protocol: string;
    key: string;
    cert: string;
  };

  let result;

  if (typedArgv.protocol === 'https') {
    const options = {
      key: typedArgv.key,
      cert: typedArgv.cert,
    };

    result = https.createServer(options);
  } else {
    result = http.createServer();
  }

  return result;
}