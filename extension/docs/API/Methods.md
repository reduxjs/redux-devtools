## Communicate with the extension directly

> Note this is advanced API, which you usually don't need to use with Redux enhancer. 

Use the following methods of `window.__REDUX_DEVTOOLS_EXTENSION__`:

- [connect](#connect)
- [disconnect](#disconnect)
- [send](#send)
- [listen](#listen)
- [open](#open)
- [notifyErrors](#notifyerrors)

<a id="connect"></a>
### connect([options])

##### Arguments

- [`options`] *Object* - [see the available options](Arguments.md).

##### Returns
*Object* containing the following methods:

- `subscribe(listener)` - adds a change listener. It will be called any time an action is dispatched from the monitor. Returns a function to unsubscribe the current listener. 
- `unsubscribe()` - unsubscribes all listeners.
- `send(action, state)` - sends a new action and state manually to be shown on the monitor. If action is `null` then we suppose we send `liftedState`. 
- `init(state)` - sends the initial state to the monitor.
- `error(message)` - sends the error message to be shown in the extension's monitor.

Example of usage:

```js
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config);
devTools.subscribe((message) => {
  if (message.type === 'DISPATCH' && message.state) {
    console.log('DevTools requested to change the state to', message.state);
  }
});
devTools.init({ value: 'initial state' });
devTools.send('change state', { value: 'state changed' })
```

See [redux enhancer's example](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/npm-package/logOnly.js), [react example](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/examples/react-counter-messaging/components/Counter.js) and [blog post](https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f) for more details.

### disconnect()

Remove extensions listener and disconnect extensions background script connection. Usually just unsubscribing the listener inside the `connect` is enough.  

<a id="send"></a>
### send(action, state, [options, instanceId])

Send a new action and state manually to be shown on the monitor. It's recommended to use [`connect`](connect), unless you want to hook into an already created instance.

##### Arguments

- `action` *String* (action type) or *Object* with required `type` key.
- `state` *any* - usually object to expand. 
- [`options`] *Object* - [see the available options](Arguments.md).
- [`instanceId`] *String* - instance id for which to include the log. If not specified and not present in the `options` object, will be the first available instance.

<a id="listen"></a>
### listen(onMessage, instanceId)

Listen for messages dispatched for specific `instanceId`. For most cases it's better to use `subcribe` inside the [`connect`](connect).

##### Arguments

- `onMessage` *Function* to call when there's an action from the monitor.
- `instanceId` *String* - instance id for which to handle actions.  

<a id="open"></a>
### open([position])

Open the extension's window. This should be conditional (usually you don't need to open extension's window automatically).

##### Arguments

- [`position`] *String* - window position: `left`, `right`, `bottom`. Also can be `panel` to [open it in a Chrome panel](../FAQ.md#how-to-keep-devtools-window-focused-all-the-time-in-a-chrome-panel). Or `remote` to [open remote monitor](../FAQ.md#how-to-get-it-work-with-webworkers-react-native-hybrid-desktop-and-server-side-apps). By default is `left`.

<a id="notifyErrors"></a>
### notifyErrors([onError])

When called, the extension will listen for uncaught exceptions on the page, and, if any, will show native notifications. Optionally, you can provide a function to be called when an exception occurs.

##### Arguments

- [`onError`] *Function* to call when there's an exceptions.
