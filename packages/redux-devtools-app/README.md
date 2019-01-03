Remote Redux DevTools monitor app
==================================

![Demo](https://raw.githubusercontent.com/zalmoxisus/remote-redux-devtools/master/demo.gif)

Web, Electron and Chrome app for monitoring [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools). Can be accessed on [`remotedev.io`](http://remotedev.io/local).

Also it's a react component you can use to build amazing monitor applications like:

* [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).
* [react-native-debugger](https://github.com/jhen0409/react-native-debugger) - Electron app, which already includes `remotedev-server`, `remotedev-app` and even React DevTools.
* [remote-redux-devtools-on-debugger](https://github.com/jhen0409/remote-redux-devtools-on-debugger) - Used in React Native debugger as a dock monitor.
* [atom-redux-devtools](https://github.com/zalmoxisus/atom-redux-devtools) - Used in Atom editor.
* [vscode-redux-devtools](https://github.com/jkzing/vscode-redux-devtools) - Used in Visual Studio Code.

### Usage

```js
import React from 'react';
import ReactDom from 'react-dom';
import DevToolsApp from 'remotedev-app';

ReactDom.render(
  <App />,
  document.getElementById('root')
);

```

### Parameters

* `socketOptions` - *object* used to specify predefined options for the connection:
  * `hostname` - *string*
  * `port` - *number or string*
  * `autoReconnect` - *boolean*
  * `secure` - *boolean*.
* `monitorOptions` - *object* used to specify predefined monitor options:
  * `selected` - *string* - which monitor is selected by default. One of the following values: `LogMonitor`, `InspectorMonitor`, `ChartMonitor`.
* `testTemplates` - *array* of strings representing predefined test templates.
* `noSettings` - *boolean* set to `true` in order to hide settings button and dialog.

### License

MIT
