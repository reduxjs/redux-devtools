import childProcess from 'child_process';
import request from 'supertest';
import socketClusterClient from 'socketcluster-client';

jest.setTimeout(10000);

describe('Server', function () {
  let scServer: childProcess.ChildProcess;
  beforeAll(async function () {
    scServer = childProcess.fork(__dirname + '/../bin/redux-devtools.js');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(function () {
    if (scServer) {
      scServer.kill();
    }
  });

  describe('Express backend', function () {
    it('loads main page', function () {
      return new Promise<void>((done) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        request('http://localhost:8000')
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200)
          .then(function (res: { text: string }) {
            expect(res.text).toMatch(/<title>Redux DevTools<\/title>/);
            done();
          });
      });
    });

    it('resolves an inexistent url', function () {
      return new Promise((done) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        request('http://localhost:8000/jreerfr/123')
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200, done);
      });
    });
  });

  describe('Realtime monitoring', function () {
    let socket: socketClusterClient.AGClientSocket,
      socket2: socketClusterClient.AGClientSocket,
      channel;
    beforeAll(function () {
      socket = socketClusterClient.create({
        hostname: 'localhost',
        port: 8000,
      });
      socket.connect();
      void (async () => {
        for await (const data of socket.listener('error')) {
          console.error('Socket1 error', data.error); // eslint-disable-line no-console
        }
      })();
      socket2 = socketClusterClient.create({
        hostname: 'localhost',
        port: 8000,
      });
      socket2.connect();
      void (async () => {
        for await (const data of socket2.listener('error')) {
          console.error('Socket2 error', data.error); // eslint-disable-line no-console
        }
      })();
    });

    afterAll(function () {
      socket.disconnect();
      socket2.disconnect();
    });

    it('should connect', async function () {
      const data = await socket.listener('connect').once();
      expect(data.id).toBeTruthy();
    });

    it('should login', async function () {
      try {
        const channelName = (await socket.invoke('login', 'master')) as string;
        expect(channelName).toBe('respond');
        channel = socket.subscribe(channelName);
        expect(channel.SUBSCRIBED).toBe('subscribed');
      } catch (error) {
        console.log(error);
      }
    });

    it('should send message', async function () {
      const data = {
        type: 'ACTION',
        payload: {
          todos: 'do some',
        },
        action: {
          timestamp: 1483349708506,
          action: {
            type: 'ADD_TODO',
            text: 'hggg',
          },
        },
        instanceId: 'tAmA7H5fclyWhvizAAAi',
        name: 'LoggerInstance',
        id: 'tAmA7H5fclyWhvizAAAi',
      };

      try {
        const channelName = (await socket.invoke('login', '')) as string;
        expect(channelName).toBe('log');
        const channel2 = socket2.subscribe(channelName);
        expect(channel2.SUBSCRIBED).toBe('subscribed');
        const message = await channel2.listener('subscribe').once();
        expect(message).toEqual(data);
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe('REST backend', function () {
    let id: string;
    const report = {
      type: 'ACTIONS',
      title: 'Test report',
      description: 'Test body report',
      action: 'SOME_FINAL_ACTION',
      payload: '[{"type":"ADD_TODO","text":"hi"},{"type":"SOME_FINAL_ACTION"}]',
      preloadedState:
        '{"todos":[{"text":"Use Redux","completed":false,"id":0}]}',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
    };
    it('should add a report', async function () {
      const res = await request('http://localhost:8000')
        .post('/')
        .send(report)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200);
      id = res.body.id;
      expect(id).toBeTruthy();
    });

    it('should get the report', async function () {
      const res = await request('http://localhost:8000')
        .post('/')
        .send({
          op: 'get',
          id: id,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200);
      expect(res.body).toMatchObject(report);
    });

    it('should list reports', async function () {
      const res = await request('http://localhost:8000')
        .post('/')
        .send({
          op: 'list',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(id);
      expect(res.body[0].title).toBe('Test report');
      expect(res.body[0].added).toBeTruthy();
    });
  });

  describe('GraphQL backend', function () {
    it('should get the report', async function () {
      const res = await request('http://localhost:8000')
        .post('/graphql')
        .send({
          query: '{ reports { id, type, title } }',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200);
      const reports = res.body.data.reports;
      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBeTruthy();
      expect(reports[0].title).toBe('Test report');
      expect(reports[0].type).toBe('ACTIONS');
    });
  });
});
