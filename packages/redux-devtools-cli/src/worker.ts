import SCWorker from 'socketcluster/scworker';
import express from 'express';
import routes from './routes';
import createStore from './store';

const app = express();

class Worker extends SCWorker {
  run() {
    const httpServer = this.httpServer;
    const scServer = this.scServer;
    const options = this.options;
    const store = createStore(options);

    httpServer.on('request', app);

    app.use(routes(options, store, scServer));

    scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
      const channel = req.event;
      const data = req.data;
      if (
        channel.substr(0, 3) === 'sc-' ||
        channel === 'respond' ||
        channel === 'log'
      ) {
        scServer.exchange.publish(channel, data);
      } else if (channel === 'log-noid') {
        scServer.exchange.publish('log', { id: req.socket.id, data: data });
      }
      next();
    });

    scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (req, next) {
      next();
      if (req.channel === 'report') {
        store
          .list()
          .then(function (data) {
            req.socket.emit(req.channel!, { type: 'list', data: data });
          })
          .catch(function (error) {
            console.error(error); // eslint-disable-line no-console
          });
      }
    });

    scServer.on('connection', function (socket) {
      let channelToWatch: string, channelToEmit: string;
      socket.on('login', function (this: Worker, credentials, respond) {
        if (credentials === 'master') {
          channelToWatch = 'respond';
          channelToEmit = 'log';
        } else {
          channelToWatch = 'log';
          channelToEmit = 'respond';
        }
        this.exchange.subscribe('sc-' + socket.id).watch(function (msg) {
          socket.emit(channelToWatch, msg);
        });
        respond(null, channelToWatch);
      });
      socket.on('getReport', function (id, respond) {
        store
          .get(id)
          .then(function (data) {
            respond(null, data);
          })
          .catch(function (error) {
            console.error(error); // eslint-disable-line no-console
          });
      });
      socket.on('disconnect', function (this: Worker) {
        const channel = this.exchange.channel('sc-' + socket.id);
        channel.unsubscribe();
        channel.destroy();
        scServer.exchange.publish(channelToEmit, {
          id: socket.id,
          type: 'DISCONNECTED',
        });
      });
    });
  }
}

new Worker();
