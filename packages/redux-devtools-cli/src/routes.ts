import path from 'path';
import express from 'express';
import morgan from 'morgan';
import * as http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SCServer } from 'socketcluster-server';
import { ApolloServer } from 'apollo-server-express';
import { AddData, ReportBaseFields, Store } from './store';
import { resolvers, schema } from './api/schema';

const app = express.Router();

function serveUmdModule(name: string) {
  app.use(
    express.static(
      path.dirname(require.resolve(name + '/package.json')) + '/umd'
    )
  );
}

function routes(
  options: SCServer.SCServerOptions,
  store: Store,
  scServer: SCServer
) {
  const limit = options.maxRequestBody;
  const logHTTPRequests = options.logHTTPRequests;

  if (logHTTPRequests) {
    if (typeof logHTTPRequests === 'object')
      app.use(
        morgan(
          'combined',
          logHTTPRequests as morgan.Options<
            http.IncomingMessage,
            http.ServerResponse
          >
        )
      );
    else app.use(morgan('combined'));
  }

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      store: store,
    },
  });
  server
    .start()
    .then(() => {
      server.applyMiddleware({ app } as {
        app: express.Application;
      });
    })
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });

  serveUmdModule('react');
  serveUmdModule('react-dom');
  serveUmdModule('@redux-devtools/app');

  app.get('/port.js', function (req, res) {
    res.send(`reduxDevToolsPort = ${options.port!}`);
  });
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../app/index.html'));
  });

  app.use(cors({ methods: 'POST' }));
  app.use(bodyParser.json({ limit: limit }));
  app.use(bodyParser.urlencoded({ limit: limit, extended: false }));

  app.post('/', function (req, res) {
    if (!req.body) return res.status(404).end();
    switch (req.body.op) {
      case 'get':
        store
          .get(req.body.id as string)
          .then(function (r) {
            res.send(r || {});
          })
          .catch(function (error) {
            console.error(error); // eslint-disable-line no-console
            res.sendStatus(500);
          });
        break;
      case 'list':
        store
          .list(req.body.query as string, req.body.fields as string[])
          .then(function (r) {
            res.send(r);
          })
          .catch(function (error) {
            console.error(error); // eslint-disable-line no-console
            res.sendStatus(500);
          });
        break;
      default:
        store
          .add(req.body as AddData)
          .then(function (r) {
            res.send({
              id: (r as ReportBaseFields).id,
              error: (r as { error: string }).error,
            });
            scServer.exchange.publish('report', {
              type: 'add',
              data: r,
            });
          })
          .catch(function (error) {
            console.error(error); // eslint-disable-line no-console
            res.status(500).send({});
          });
    }
  });
  return app;
}

export default routes;
