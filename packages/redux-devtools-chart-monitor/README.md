# Redux DevTools Chart Monitor

A chart monitor for [Redux DevTools](https://github.com/gaearon/redux-devtools).

Created by [@romseguy](https://github.com/romseguy) and merged from [`reduxjs/redux-devtools-chart-monitor`](https://github.com/reduxjs/redux-devtools-chart-monitor).

It shows a real-time view of the store aka the current state of the app.

:rocket: Now with immutable-js support.

[Demo](http://romseguy.github.io/redux-store-visualizer/) [(Source)](https://github.com/romseguy/redux-store-visualizer)

![Chart Monitor](https://camo.githubusercontent.com/19aebaeba929e97f97225115c49dc994299cb76e/687474703a2f2f692e696d6775722e636f6d2f4d53677655366c2e676966)

### Installation

```
yarn add --dev redux-devtools-chart-monitor
```

### Usage

You can use `ChartMonitor` as the only monitor in your app:

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import ChartMonitor from 'redux-devtools-chart-monitor';

export default createDevTools(<ChartMonitor />);
```

Then you can render `<DevTools>` to any place inside app or even into a separate popup window.

Alternatively, you can use it together with [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) to make it dockable.  
Consult the [`DockMonitor` README](https://github.com/gaearon/redux-devtools-dock-monitor) for details of this approach.

[Read how to start using Redux DevTools.](https://github.com/reduxjs/redux-devtools)

### Features

### Props

#### ChartMonitor props

You can read the React component [propTypes](https://github.com/reduxjs/redux-devtools/blob/master/packages/redux-devtools-chart-monitor/src/Chart.js#L11) in addition to the details below:

| Name                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultIsVisible`        | By default, set to `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `transitionDuration`      | By default, set to `750`, in milliseconds.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `heightBetweenNodesCoeff` | By default, set to `1`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `widthBetweenNodesCoeff`  | By default, set to `1.3`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `isSorted`                | By default, set to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `style`                   | {<br>&nbsp;&nbsp;width: '100%', height: '100%', // i.e fullscreen for [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor)<br>&nbsp;&nbsp;text: {<br>&nbsp;&nbsp;&nbsp;&nbsp;colors: {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'default': `theme.base0D`,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hover: `theme.base06`<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;node: {<br>&nbsp;&nbsp;&nbsp;&nbsp;colors: {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'default': `theme.base0B`,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;collapsed: `theme.base0B`,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parent: `theme.base0E`<br>&nbsp;&nbsp;&nbsp;&nbsp;},<br>&nbsp;&nbsp;&nbsp;&nbsp;radius: 7<br>&nbsp;&nbsp;}<br>} |
| `onClickText`             | Function called with a reference to the clicked node as first argument when clicking on the text next to a node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `tooltipOptions`          | {<br>&nbsp;&nbsp;disabled: false,<br>&nbsp;&nbsp;indentationSize: 2,<br>&nbsp;&nbsp;style: {<br>&nbsp;&nbsp;&nbsp;&nbsp;'background-color': `theme.base06`,<br>&nbsp;&nbsp;&nbsp;&nbsp;'opacity': '0.7',<br>&nbsp;&nbsp;&nbsp;&nbsp;'border-radius': '5px',<br>&nbsp;&nbsp;&nbsp;&nbsp;'padding': '5px'<br>&nbsp;&nbsp;}<br>}<br>[More info](https://github.com/reduxjs/redux-devtools/tree/master/packages/d3tooltip#api).                                                                                                                                                                                                                                                                                                                    |

#### Redux DevTools props

| Name          | Description                                                                                                                                                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`       | Either a string referring to one of the themes provided by [redux-devtools-themes](https://github.com/gaearon/redux-devtools-themes) (feel free to contribute!) or a custom object of the same format. Optional. By default, set to [`'nicinabox'`](https://github.com/gaearon/redux-devtools-themes/blob/master/src/nicinabox.js). |
| `invertTheme` | Boolean value that will invert the colors of the selected theme. Optional. By default, set to `false`                                                                                                                                                                                                                               |
| `select`      | A function that selects the slice of the state for DevTools to show. For example, `state => state.thePart.iCare.about`. Optional. By default, set to `state => state`.                                                                                                                                                              |

### License

MIT
