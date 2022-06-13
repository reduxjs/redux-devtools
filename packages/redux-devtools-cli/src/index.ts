import express from 'express';
import http from 'http';
import getPort from 'getport';
import socketClusterServer from 'socketcluster-server';
import getOptions, { Options } from './options';
import routes from './routes';
import createStore from './store';

// var LOG_LEVEL_NONE = 0;
const LOG_LEVEL_ERROR = 1;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_INFO = 3;

export interface ExtendedOptions extends Options {
  allowClientPublish: boolean;
}

export default function (argv: { [arg: string]: any }): Promise<{
  portAlreadyUsed?: boolean;
  listener: (eventName: 'ready') => { once(): Promise<void> };
}> {
  const options = Object.assign(getOptions(argv), {
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
          listener: function (eventName: 'ready') {
            return {
              once() {
                return Promise.resolve();
              },
            };
          },
        });
      } else {
        if (logLevel >= LOG_LEVEL_INFO) {
          console.log('[ReduxDevTools] Start server...');
          console.log('-'.repeat(80) + '\n');
        }
        const httpServer = http.createServer();
        const agServer = socketClusterServer.attach(httpServer, options);

        const app = express();
        httpServer.on('request', app);
        const store = createStore(options);
        app.use(routes(options, store, agServer));

        agServer.setMiddleware(
          agServer.MIDDLEWARE_INBOUND,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (middlewareStream) => {
            for await (const action of middlewareStream) {
              if (action.type === action.TRANSMIT) {
                const channel = action.receiver;
                const data = action.data;
                if (
                  channel.substring(0, 3) === 'sc-' ||
                  channel === 'respond' ||
                  channel === 'log'
                ) {
                  void agServer.exchange.transmitPublish(channel, data);
                } else if (channel === 'log-noid') {
                  void agServer.exchange.transmitPublish('log', {
                    id: action.socket.id,
                    data: data,
                  });
                }
              } else if (action.type === action.SUBSCRIBE) {
                if (action.channel === 'report') {
                  store
                    .list()
                    .then(function (data) {
                      void agServer.exchange.transmitPublish('report', {
                        type: 'list',
                        data: data,
                      });
                    })
                    .catch(function (error) {
                      console.error(error); // eslint-disable-line no-console
                    });
                }
              }
              action.allow();
            }
          }
        );

        void (async () => {
          for await (const { socket } of agServer.listener('connection')) {
            let channelToWatch: string, channelToEmit: string;
            void (async () => {
              for await (const request of socket.procedure('login')) {
                const credentials = request.data;
                if (credentials === 'master') {
                  channelToWatch = 'respond';
                  channelToEmit = 'log';
                } else {
                  channelToWatch = 'log';
                  channelToEmit = 'respond';
                }
                request.end(channelToWatch);
              }
            })();
            void (async () => {
              for await (const request of socket.procedure('getReport')) {
                const id = request.data as string;
                store
                  .get(id)
                  .then(function (data) {
                    request.end(data);
                  })
                  .catch(function (error) {
                    console.error(error); // eslint-disable-line no-console
                  });
              }
            })();
            void (async () => {
              for await (const data of socket.listener('disconnect')) {
                const channel = agServer.exchange.channel('sc-' + socket.id);
                channel.unsubscribe();
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                void agServer.exchange.transmitPublish(channelToEmit!, {
                  id: socket.id,
                  type: 'DISCONNECTED',
                });
              }
            })();
          }
        })();

        httpServer.listen(options.port);
        // @ts-expect-error Shouldn't there be a 'ready' event?
        resolve(agServer);
      }
      /* eslint-enable no-console */
    });
  });
}
