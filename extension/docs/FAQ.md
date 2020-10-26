# Redux DevTools Extension FAQ

## Table of Contents
- [How to get it work](#how-to-get-it-work)
- [How to disable/enable it in production](#how-to-disable-it-in-production)
- [How to persist debug sessions across page reloads](#how-to-persist-debug-sessions-across-page-reloads)
- [How to open DevTools programmatically](#how-to-open-devtools-programmatically)
- [How to enable/disable errors notifying](#how-to-enabledisable-errors-notifying)
- [How to get it work with WebWorkers, React Native, hybrid, desktop and server side apps](#how-to-get-it-work-with-webworkers-react-native-hybrid-desktop-and-server-side-apps)
- [Keyboard shortcuts](#keyboard-shortcuts)

#### How to get it work
- Check the extension with [Counter](http://zalmoxisus.github.io/examples/counter/) or [TodoMVC](http://zalmoxisus.github.io/examples/todomvc/) demo.
- Reload the extension on the extensions page (`chrome://extensions/`).
- If something goes wrong, [open an issue](https://github.com/zalmoxisus/redux-devtools-extension/issues) or tweet me: [@mdiordiev](https://twitter.com/mdiordiev).

#### How to disable it in production
Usually you don't have to. See [the article for details on how to include it in production](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f). 
#### How to persist debug sessions across page reloads
Just click the `Persist` button or add `?debug_session=<session_name>` to the url.
#### How to open DevTools programmatically
```js
window.__REDUX_DEVTOOLS_EXTENSION__.open();
```
Make sure to have it conditionally. Auto opening windows is a bad DX. See the [API](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Methods.md#open) for details.
#### How to enable/disable errors notifying
Just find `Redux DevTools` on the extensions page (`chrome://extensions/`) and click the `Options` link to customize everything. The errors notifying is disabled by default. If enabled, it works only when the store enhancer is called (in order not to show notifications for any sites you visit). In case you want notifications for a non-redux app, init it explicitly by calling `window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors()` (probably you'll check if `window.__REDUX_DEVTOOLS_EXTENSION__` exists before calling it).
#### How to get it work with WebWorkers, React Native, hybrid, desktop and server side apps
It is not possible to inject extension's script there and to communicate directly. To solve this, use [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools). After including it inside the app, click `Remote` button for remote monitoring. 
#### Keyboard shortcuts
To set/change the keyboard shortcuts, click "Keyboard shortcuts" button on the bottom of the extensions page (`chrome://extensions/`). By default only `Cmd` (`Ctrl`) + `Shift` + `E` is available, which will open the extension popup (only when the Redux store is available in the current page).
