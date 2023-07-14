import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import express from 'express';
import type { Router } from 'express';
import morgan from 'morgan';
import * as http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AGServer } from 'socketcluster-server';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import type { AddData, ReportBaseFields, Store } from './store.js';
import { resolvers, schema } from './api/schema.js';

const app = express.Router();

const require = createRequire(import.meta.url);

function serveUmdModule(name: string) {
  app.use(
    express.static(
      path.dirname(require.resolve(name + '/package.json')) + '/umd',
    ),
  );
}

interface Context {
  store?: Store;
}

function routes(
  options: AGServer.AGServerOptions,
  store: Store,
  scServer: AGServer,
): Router {
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
          >,
        ),
      );
    else app.use(morgan('combined'));
  }

  const server = new ApolloServer<Context>({
    typeDefs: schema,
    resolvers,
  });
  server
    .start()
    .then(() => {
      app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
          context: () => Promise.resolve({ store }),
        }),
      );
    })
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });

  serveUmdModule('react');
  serveUmdModule('react-dom');
  serveUmdModule('@redux-devtools/app');

  app.get('/port.js', function (req, res) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    res.send(`reduxDevToolsPort = ${options.port}`);
  });
  app.get('*', function (req, res) {
    res.sendFile(
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '../app/index.html',
      ),
    );
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
            void scServer.exchange.transmitPublish('report', {
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
