Redux DevTools Log Monitor
=========================

The default monitor for [Redux DevTools](https://github.com/gaearon/redux-devtools) with a tree view.  
It shows a log of states and actions, and lets you change their history.

![](http://i.imgur.com/J4GeW0M.gif)

### Installation

```
npm install --save-dev redux-devtools-log-monitor
```

### Usage

You can use `LogMonitor` as the only monitor in your app:

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';

export default createDevTools(
  <LogMonitor />
);
```

Then you can render `<DevTools>` to any place inside app or even into a separate popup window.

Alternative, you can use it together with [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) to make it dockable.  
Consult the [`DockMonitor` README](https://github.com/gaearon/redux-devtools-dock-monitor) for details of this approach.

[Read how to start using Redux DevTools.](https://github.com/gaearon/redux-devtools)

### Features

Every action is displayed in the log. You can expand the tree view to inspect the `action` object and the `state` after it.

If a reducer throws while handling an action, you will see “Interrupted by an error up the chain” instead of the state and action tree view. Scroll up until you find the action which caused the error. You will see the error message in the action log entry. If you use a hot reloading tool, you can edit the reducer, and the error will automatically update or go away.

Clicking an action will disable it. It will appear crossed out, and the state will be recalculated as if the action never happened. Clicking it once again will enable it back. Use this together with a hot reloading solution to work sequentially on different states of your app without reproducing them by hand. You can toggle any action except for the initial one.

There are four buttons at the very top. “Reset” takes your app to the state you created the store with. The other three buttons work together. You might find it useful to think of them like you think of Git commits. “Commit” removes all actions in your log, and makes the current state your initial state. This is useful when you start working on a feature and want to remove the previous noise. After you’ve dispatched a few actions, you can press “Revert” to go back to the last committed state. Finally, if you dispatched some actions by mistake and you don’t want them around, you can toggle them by clicking on them, and press “Sweep” to completely remove all currently disabled actions from the log.

### Props

Name                  | Description
-------------         | -------------
`theme`               | Either a string referring to one of the themes provided by [redux-devtools-themes](https://github.com/gaearon/redux-devtools-themes) (feel free to contribute!) or a custom object of the same format. Optional. By default, set to [`'nicinabox'`](https://github.com/gaearon/redux-devtools-themes/blob/master/src/nicinabox.js).
`select`              | A function that selects the slice of the state for DevTools to show. For example, `state => state.thePart.iCare.about`. Optional. By default, set to `state => state`.
`preserveScrollTop`   | When `true`, records the current scroll top every second so it can be restored on refresh. This only has effect when used together with `persistState()` enhancer from Redux DevTools. By default, set to `true`.
`expandActionRoot`    | When `true`, displays the action object expanded rather than collapsed. By default, set to `true`.
`expandStateRoot`     | When `true`, displays the state object expanded rather than collapsed. By default, set to `true`.
`markStateDiff`       | When `true`, mark the state's values which were changed comparing to the previous state. It affects the performance significantly! You might also want to set `expandStateRoot` to `true` as well when enabling it. By default, set to `false`.
`hideMainButtons`     | When `true`, will show only the logs without the top button bar. By default, set to `false`.

### License

MIT
