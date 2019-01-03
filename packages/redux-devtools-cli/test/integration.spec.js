var childProcess = require('child_process');
var request = require('supertest');
var expect = require('expect');
var scClient = require('socketcluster-client');
var remotedev = require('../');

describe('Server', function() {
  var scServer;
  this.timeout(5000);
  before(function(done) {
    scServer = childProcess.fork(__dirname + '/../bin/remotedev.js');
    setTimeout(done, 2000);
  });

  after(function() {
    if (scServer) {
      scServer.kill();
    }
  });

  describe('Express backend', function() {
    it('loads main page', function() {
      request('http://localhost:8000')
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .then(function(res) {
          expect(res.text).toMatch(/<title>RemoteDev<\/title>/);
        })
    });

    it('resolves an inexistent url', function(done) {
      request('http://localhost:8000/jreerfr/123')
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });

  describe('Realtime monitoring', function() {
    var socket, socket2, channel;
    before(function() {
      socket = scClient.connect({ hostname: 'localhost', port: 8000 });
      socket.connect();
      socket.on('error', function(error) {
        console.error('Socket1 error', error);
      });
      socket2 = scClient.connect({ hostname: 'localhost', port: 8000 });
      socket2.connect();
      socket.on('error', function(error) {
        console.error('Socket2 error', error);
      });
    });

    after(function() {
      socket.disconnect();
      socket2.disconnect();
    });

    it('should connect', function(done) {
      socket.on('connect', function(status) {
        expect(status.id).toExist();
        done();
      });
    });

    it('should login', function() {
      socket.emit('login', 'master', function(error, channelName) {
        if (error) { console.log(error); return; }
        expect(channelName).toBe('respond');
        channel = socket.subscribe(channelName);
        expect(channel.SUBSCRIBED).toBe('subscribed');
      });
    });

    it('should send message', function(done) {
      var data = {
        "type": "ACTION",
        "payload": {
          "todos": "do some"
        },
        "action": {
          "timestamp": 1483349708506,
          "action": {
            "type": "ADD_TODO",
            "text": "hggg"
          }
        },
        "instanceId": "tAmA7H5fclyWhvizAAAi",
        "name": "LoggerInstance",
        "id": "tAmA7H5fclyWhvizAAAi"
      };

      socket2.emit('login', '', function(error, channelName) {
        if (error) { console.log(error); return; }
        expect(channelName).toBe('log');
        var channel2 = socket2.subscribe(channelName);
        expect(channel2.SUBSCRIBED).toBe('subscribed');
        channel2.on('subscribe', function() {
          channel2.watch(function(message) {
            expect(message).toEqual(data);
            done();
          });
          socket.emit(channelName, data);
        })
      });
    });
  });

  describe('REST backend', function() {
    var id;
    var report = {
      type: 'ACTIONS',
      title: 'Test report',
      description: 'Test body report',
      action: 'SOME_FINAL_ACTION',
      payload: '[{"type":"ADD_TODO","text":"hi"},{"type":"SOME_FINAL_ACTION"}]',
      preloadedState: '{"todos":[{"text":"Use Redux","completed":false,"id":0}]}',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    };
    it('should add a report', function() {
      request('http://localhost:8000')
        .post('/')
        .send(report)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(function(res) {
          id = res.body.id;
          expect(id).toExist();
        });
    });

    it('should get the report', function() {
      request('http://localhost:8000')
        .post('/')
        .send({
          op: 'get',
          id: id
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(function(res) {
          expect(res.body).toInclude(report);
        });
    });

    it('should list reports', function() {
      request('http://localhost:8000')
        .post('/')
        .send({
          op: 'list'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(id);
          expect(res.body[0].title).toBe('Test report');
          expect(res.body[0].added).toExist();
        });
    });
  });

  describe('GraphQL backend', function() {
    it('should get the report', function() {
      request('http://localhost:8000')
        .post('/graphql')
        .send({
          query: '{ reports { id, type, title } }'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(function(res) {
          var reports = res.body.data.reports;
          expect(reports.length).toBe(1);
          expect(reports[0].id).toExist();
          expect(reports[0].title).toBe('Test report');
          expect(reports[0].type).toBe('ACTIONS');
        });
    });
  });
});
