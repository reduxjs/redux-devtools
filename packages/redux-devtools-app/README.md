# Redux DevTools monitor app

![Demo](https://raw.githubusercontent.com/zalmoxisus/remote-redux-devtools/master/demo.gif)

Web, Electron and Chrome app for monitoring [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools).

Also it's a react component you can use to build amazing monitor applications like:

- [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).
- [react-native-debugger](https://github.com/jhen0409/react-native-debugger) - Electron app, which already includes `remotedev-server`, `redux-devtools-app` and even React DevTools.
- [remote-redux-devtools-on-debugger](https://github.com/jhen0409/remote-redux-devtools-on-debugger) - Used in React Native debugger as a dock monitor.
- [atom-redux-devtools](https://github.com/zalmoxisus/atom-redux-devtools) - Used in Atom editor.
- [vscode-redux-devtools](https://github.com/jkzing/vscode-redux-devtools) - Used in Visual Studio Code.

### Usage

```js
import React from 'react';
import ReactDom from 'react-dom';
import DevToolsApp from '@redux-devtools/app';

ReactDom.render(<App />, document.getElementById('root'));
```

### Parameters

- `socketOptions` - _object_ used to specify predefined options for the connection:
  - `hostname` - _string_
  - `port` - _number or string_
  - `autoReconnect` - _boolean_
  - `secure` - _boolean_.
- `monitorOptions` - _object_ used to specify predefined monitor options:
  - `selected` - _string_ - which monitor is selected by default. One of the following values: `LogMonitor`, `InspectorMonitor`, `ChartMonitor`.
- `testTemplates` - _array_ of strings representing predefined test templates.
- `noSettings` - _boolean_ set to `true` in order to hide settings button and dialog.

### License

MIT
