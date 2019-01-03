var SCWorker = require("socketcluster/scworker");
var path = require('path');
var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var graphiqlMiddleware = require('./middleware/graphiql');
var graphqlMiddleware = require('./middleware/graphql');
var createStore = require('./store');

class Worker extends SCWorker {
  run() {
    var httpServer = this.httpServer;
    var scServer = this.scServer;
    var options = this.options;
    var store = createStore(options);
    var limit = options.maxRequestBody;
    var logHTTPRequests = options.logHTTPRequests;

    httpServer.on('request', app);

    app.set('view engine', 'ejs');
    app.set('views', path.resolve(__dirname, '..', 'views'));

    if (logHTTPRequests) {
      if (typeof logHTTPRequests === 'object') app.use(morgan('combined', logHTTPRequests));
      else app.use(morgan('combined'));
    }

    app.use('/graphiql', graphiqlMiddleware);

    app.get('*', function (req, res) {
      res.render('index', {port: options.port});
    });

    app.use(cors({methods: 'POST'}));
    app.use(bodyParser.json({limit: limit}));
    app.use(bodyParser.urlencoded({limit: limit, extended: false}));

    app.use('/graphql', graphqlMiddleware(store));

    app.post('/', function (req, res) {
      if (!req.body) return res.status(404).end();
      switch (req.body.op) {
        case 'get':
          store.get(req.body.id).then(function (r) {
            res.send(r || {});
          }).catch(function (error) {
            console.error(error);
            res.sendStatus(500)
          });
          break;
        case 'list':
          store.list(req.body.query, req.body.fields).then(function (r) {
            res.send(r);
          }).catch(function (error) {
            console.error(error);
            res.sendStatus(500)
          });
          break;
        default:
          store.add(req.body).then(function (r) {
            res.send({id: r.id, error: r.error});
            scServer.exchange.publish('report', {
              type: 'add', data: r
            });
          }).catch(function (error) {
            console.error(error);
            res.status(500).send({})
          });
      }
    });

    scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
      var channel = req.event;
      var data = req.data;
      if (channel.substr(0, 3) === 'sc-' || channel === 'respond' || channel === 'log') {
        scServer.exchange.publish(channel, data);
      } else if (channel === 'log-noid') {
        scServer.exchange.publish('log', {id: req.socket.id, data: data});
      }
      next();
    });

    scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (req, next) {
      next();
      if (req.channel === 'report') {
        store.list().then(function (data) {
          req.socket.emit(req.channel, {type: 'list', data: data});
        }).catch(function (error) {
          console.error(error);
        });
      }
    });

    scServer.on('connection', function (socket) {
      var channelToWatch, channelToEmit;
      socket.on('login', function (credentials, respond) {
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
        store.get(id).then(function (data) {
          respond(null, data);
        }).catch(function (error) {
          console.error(error);
        });
      });
      socket.on('disconnect', function () {
        var channel = this.exchange.channel('sc-' + socket.id);
        channel.unsubscribe();
        channel.destroy();
        scServer.exchange.publish(
          channelToEmit,
          {id: socket.id, type: 'DISCONNECTED'}
        );
      });
    });
  };
}

new Worker();
