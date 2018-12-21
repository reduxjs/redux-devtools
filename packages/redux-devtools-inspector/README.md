# redux-devtools-inspector

[![npm version](https://badge.fury.io/js/redux-devtools-inspector.svg)](https://badge.fury.io/js/redux-devtools-inspector)

A state monitor for [Redux DevTools](https://github.com/gaearon/redux-devtools) that provides a convenient way to inspect "real world" app states that could be complicated and deeply nested.

![](https://raw.githubusercontent.com/alexkuz/redux-devtools-inspector/master/demo.gif)

### Installation

```
npm install --save-dev redux-devtools-inspector
```

### Usage

You can use `Inspector` as the only monitor in your app:

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import Inspector from 'redux-devtools-inspector';

export default createDevTools(
  <Inspector />
);
```

Then you can render `<DevTools>` to any place inside app or even into a separate popup window.

Alternative, you can use it together with [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) to make it dockable.  
Consult the [`DockMonitor` README](https://github.com/gaearon/redux-devtools-dock-monitor) for details of this approach.

[Read how to start using Redux DevTools.](https://github.com/gaearon/redux-devtools)

### Features

The inspector displays a list of actions and a preview panel which shows the state after the selected action and a diff with the previous state. If no actions are selected, the last state is shown.

You may pin a certain part of the state to only track its changes.

### Props

Name               | Type             | Description
------------------ | ---------------- | -------------
`theme`            | Object or string | Contains either [base16](https://github.com/chriskempson/base16) theme name or object, that can be `base16` colors map or object containing classnames or styles.
`invertTheme`      | Boolean          | Inverts theme color luminance, making light theme out of dark theme and vice versa.
`supportImmutable` | Boolean          | Better `Immutable` rendering in `Diff` (can affect performance if state has huge objects/arrays). `false` by default.
`tabs`             | Array or function | Overrides list of tabs (see below)
`diffObjectHash`   | Function         | Optional callback for better array handling in diffs (see [jsondiffpatch docs](https://github.com/benjamine/jsondiffpatch/blob/master/docs/arrays.md))
`diffPropertyFilter` | Function       | Optional callback for ignoring particular props in diff (see [jsondiffpatch docs](https://github.com/benjamine/jsondiffpatch#options))


If `tabs` is a function, it receives a list of default tabs and should return updated list, for example:
```
defaultTabs => [...defaultTabs, { name: 'My Tab', component: MyTab }]
```
If `tabs` is an array, only provided tabs are rendered.

`component` is provided with `action` and other props, see [`ActionPreview.jsx`](src/ActionPreview.jsx#L42) for reference.

Usage example: [`redux-devtools-test-generator`](https://github.com/zalmoxisus/redux-devtools-test-generator#containersdevtoolsjs).

### License

MIT
