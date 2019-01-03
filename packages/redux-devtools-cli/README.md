RemoteDev Server
================

Bridge for communicating with an application remotely via [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension), [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev). Running your server is optional, you can use [remotedev.io](https://remotedev.io) instead.

### Installation

```
npm install --save-dev remotedev-server
```

Also [there's a docker image](https://github.com/jhen0409/docker-remotedev-server) you can use.

### Usage

##### Add in your app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000"
}
```

So, you can start remotedev server by running `npm run remotedev`.

##### Import in your `server.js` script you use for starting a development server:

```js
var remotedev = require('remotedev-server');
remotedev({ hostname: 'localhost', port: 8000 });
```

So, you can start remotedev server together with your dev server.

##### Install the package globally (not recommended) just run:

```
remotedev --hostname=localhost --port=8000
```

### Connection settings

Set `hostname` and `port` to the values you want. `hostname` by default is `localhost` and `port` is `8000`.

To use WSS, set `protocol` argument to `https` and provide `key`, `cert` and `passphrase` arguments.


#### Available options

| Console argument | description                                                                                                                                             | default value |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `--hostname`     | hostname                                                                                                                                                | localhost     |
| `--port`         | port                                                                                                                                                    | 8000          |
| `--protocol`     | protocol                                                                                                                                                | http          |
| `--key`          | the key file for [running an https server](https://github.com/SocketCluster/socketcluster#using-over-https) (`--protocol` must be set to 'https')       | -             |
| `--cert`         | the cert file for [running an https server](https://github.com/SocketCluster/socketcluster#using-over-https) (`--protocol` must be set to 'https')      | -             |
| `--passphrase`   | the key passphrase for [running an https server](https://github.com/SocketCluster/socketcluster#using-over-https) (`--protocol` must be set to 'https') | -             |
| `--dbOptions`    | database configuration, can be whether an object or a path (string) to json configuration file (by default it uses our `./defaultDbOptions.json` file. Set `migrate` key to `true` to use our migrations file. [More details bellow](https://github.com/zalmoxisus/remotedev-server#save-reports-and-logs).                                   | -             |
| `--logLevel`     | the socket server log level - 0=none, 1=error, 2=warn, 3=info                                                                                           | 3             |
| `--wsEngine`     | the socket server web socket engine - ws or uws (sc-uws)                                                                                                    | ws            |

### Inject to React Native local server

##### Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000 --injectserver=reactnative"
}
```

The `injectserver` value can be `reactnative` or `macos` ([react-native-macos](https://github.com/ptmt/react-native-macos)), it used `reactnative` by default.

Then, we can start React Native server and RemoteDev server with one command (`npm start`).

##### Revert the injection

Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev-revert": "remotedev --revert=reactnative"
}
```

Or just run `$(npm bin)/remotedev --revert`.

### Connect from Android device or emulator

> Note that if you're using `injectserver` argument explained above, this step is not necessary. 

If you're running an Android 5.0+ device connected via USB or an Android emulator, use [adb command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

```
adb reverse tcp:8000 tcp:8000
```

If you're still use Android 4.0, you should use `10.0.2.2` (Genymotion: `10.0.3.2`) instead of `localhost` in [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools#storeconfigurestorejs) or [remotedev](https://github.com/zalmoxisus/remotedev#usage).

### Save reports and logs

You can store reports via [`redux-remotedev`](https://github.com/zalmoxisus/redux-remotedev) and get them replicated with [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension) or [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools). You can get action history right in the extension just by clicking the link from a report. Open `http://localhost:8000/graphiql` (assuming you're using `localhost` as host and `8000`) to explore in GraphQL. Reports are posted to `http://localhost:8000/`. See examples in [tests](https://github.com/zalmoxisus/remotedev-server/blob/937cfa1f0ac9dc12ebf7068eeaa8b03022ec33bc/test/integration.spec.js#L110-L165).

Remotedev server is database agnostic using `knex` schema. By default everything is stored in the memory using sqlite database. See [`defaultDbOptions.json`](https://github.com/zalmoxisus/remotedev-server/blob/master/defaultDbOptions.json) for example of sqlite. You can replace `"connection": { "filename": ":memory:" },` with your file name (instead of `:memory:`) to persist teh database. Here's an example for PostgreSQL:
```
{
  "client": "pg",
  "connection": { "user": "myuser", "password": "mypassword", "database": "mydb" },
  "debug": false,
  "migrate": true
}
```

### Advanced
- [Writing your integration for a native application](https://github.com/zalmoxisus/remotedev-server/blob/master/docs/API/Realtime.md)

### License 

MIT
