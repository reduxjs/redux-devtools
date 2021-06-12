## Remote monitoring

By installing [`@redux-devtools/cli`](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-cli#usage), starting the server server and launching the Redux DevTools app (`redux-devtools --open`), you can connect any remote application, even not javascript. There are some integrations for javascript like [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools) and [remotedev](https://github.com/zalmoxisus/remotedev), but the plan is to deprecate them and support it out of the box from the extension without a websocket server. It is more useful for non-js apps.

### WebSocket Clients

We're using [SocketCluster](http://socketcluster.io/) for realtime communication, which provides a fast and scalable webSocket layer and a minimal pub/sub system. You need to include one of [its clients](https://github.com/SocketCluster/client-drivers) in your app to communicate with RemotedevServer. Currently there are clients for [JavaScript (NodeJS)](https://github.com/SocketCluster/socketcluster-client), [Java](https://github.com/sacOO7/socketcluster-client-java), [Python](https://github.com/sacOO7/socketcluster-client-python), [C](https://github.com/sacOO7/socketcluster-client-C), [Objective-C](https://github.com/abpopov/SocketCluster-ios-client) and [.NET/C#](https://github.com/sacOO7/SocketclusterClientDotNet).

By default, the websocket server is running on `ws://localhost:8000/socketcluster/`.

### Messaging lifecycle

#### 1. Connecting to the WebSocket server

The client driver provides a way to connect to the server via websockets (see the docs for the selected client).

##### JavaScript

```js
var socket = socketCluster.connect({
  hostname: 'localhost',
  port: 8000,
});
```

##### Python

```py
socket = Socketcluster.socket("ws://localhost:8000/socketcluster/")
socket.connect()
```

> Note that JavaScript client composes the url from `hostname` and `port`, adding `/socketcluster/` path automatically. For other clients, you should specify that path. For example, for `ObjectiveC` it would be `self.client.initWithHost("localhost/socketcluster/", onPort: 8000, securely: false)`.

#### 2. Disconnecting and reconnecting

SocketCluster client handles reconnecting for you, but you still might want to know when the connection is established, or when it failed to connect.

##### JavaScript

```js
socket.on('connect', (status) => {
  // Here will come the next step
});
socket.on('disconnect', (code) => {
  console.warn('Socket disconnected with code', code);
});
socket.on('error', (error) => {
  console.warn('Socket error', error);
});
```

##### Python

```py
def onconnect(socket):
  // Here will call the next step

def ondisconnect(socket):
  logging.info("on disconnect got called")

def onConnectError(socket, error):
  logging.info("On connect error got called")

socket.setBasicListener(onconnect, ondisconnect, onConnectError)
```

#### 3. Authorizing and subscribing to the channel of events

We're not providing an authorizing mechanism yet. All you have to do is to emit a `login` event, and you'll get a `channelName` you should subscribe for, and watch for messages and events. Make sure to pass the `master` event, otherwise it should be a monitor, not a client app.

##### JavaScript

```js
socket.emit('login', 'master', (error, channelName) => {
  if (error) {
    console.log(error);
    return;
  }
  channel = socket.subscribe(channelName);
  channel.watch(handleMessages);
  socket.on(channelName, handleMessages);
});

function handleMessages(message) {
  // 5. Listening for monitor events
}
```

##### Python

```py
socket.emitack("login", "master", login)

def login(key, error, channelName):
  socket.subscribe(channelName)
  socket.onchannel(channelName, handleMessages)
  socket.on(channelName, handleMessages)

def handleMessages(key, message):
  // 5. Listening for monitor events
```

You could just emit the `login` event, and omit subscribing (and point `5` bellow) if you want only to log data, not to interact with te app.

#### 4. Sending the action and state to the monitor

To send your data to the monitor use `log` or `log-noid` channel. The latter will add the socket id to the message from the server side (useful when the message was sent before the connection was established).

The message object includes the following:

- `type` - usually should be `ACTION`. If you want to indicate that we're starting a new log (clear all actions emitted before and add `@@INIT`), use `INIT`. In case you have a lifted state similar to one provided by [`redux-devtools-instrument`](https://github.com/zalmoxisus/redux-devtools-instrument), use `STATE`.
- `action` - the action object. It is recommended to lift it in another object, and add `timestamp` to show when the action was fired off: `{ timestamp: Date.now(), action: { type: 'SOME_ACTION' } }`.
- `payload` - usually the state or lifted state object.
- `name` - name of the instance to be shown in the instances selector. If not provided, it will be equal to `instanceId`.
- `instanceId` - an id to identify the instance. If not provided, it will be the same as `id`. However, it is useful when having several instances (or stores) in the same connection. Also if the user will specify a constant value, it would allow to persist the state on app reload.
- `id` - socket connection id, which should be either `socket.id` or should not provided and use `log-noid` channel.

##### JavaScript

```js
const message = {
  type: 'ACTION',
  action: { action, timestamp: Date.now() },
  payload: state,
  id: socket.id,
  instanceId: window.btoa(location.href),
  name: document.title,
};
socket.emit(socket.id ? 'log' : 'log-noid', message);
```

##### Python

```py
class Message:
  def __init__(self, action, state):
    self.type = "ACTION"
    self.action = action
    self.payload = state
    id: socket.id
socket.emit(socket.id if "log" else "log-noid", Message(action, state));
```

#### 5. Listening for monitor events

When a monitor action is emitted, you'll get an event on the subscribed function. The argument object includes a `type` key, which can be:

- `DISPATCH` - a monitor action dispatched on Redux DevTools monitor, like `{ type: 'DISPATCH', payload: { type: 'JUMP_TO_STATE', 'index': 2 }`. See [`redux-devtools-instrument`](https://github.com/zalmoxisus/redux-devtools-instrument/blob/master/src/instrument.js) for details. Additionally to that API, you'll get also a stringified `state` object when needed. So, for example, for time travelling (`JUMP_TO_STATE`) you can just parse and set the state (see the example). Usually implementing this type of actions would be enough.
- `ACTION` - the user requested to dispatch an action remotely like `{ type: 'ACTION', action: '{ type: \'INCREMENT_COUNTER\' }' }`. The `action` can be either a stringified javascript object which should be evalled or a function which arguments should be evalled like [here](https://github.com/zalmoxisus/remotedev-utils/blob/master/src/index.js#L62-L70).
- `START` - a monitor was opened. You could handle this event in order not to do extra tasks when the app is not monitored.
- `STOP` - a monitor was closed. You can take this as no need to send data to the monitor. I there are several monitors and one was closed, all others will send `START` event to acknowledge that we still have to send data.

See [`mobx-remotedev`](https://github.com/zalmoxisus/mobx-remotedev/blob/master/src/monitorActions.js) for an example of implementation without [`redux-devtools-instrument`](https://github.com/zalmoxisus/redux-devtools-instrument/blob/master/src/instrument.js).

##### JavaScript

```js
function handleMessages(message) {
  if (message.type === 'DISPATCH' && message.payload.type === 'JUMP_TO_STATE') {
    store.setState(JSON.parse(message.state));
  }
}
```

##### Python

```py
def handleMessages(key, message):
  if message.type === "DISPATCH" and message.payload.type === "JUMP_TO_STATE":
    store.setState(json.loads(message.state));
```
