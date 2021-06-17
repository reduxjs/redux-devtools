# Redux DevTools RTK Query inspector monitor

Displays rtk-query queries and mutations for [Redux DevTools](https://github.com/gaearon/redux-devtools).

Created by [FaberVitale](https://github.com/FaberVitale)


![RTK Query inspector monitor demo](./monitor-demo.gif)

### Installation

```bash
npm i @redux-devtools/rtk-query-inspector-monitor --save # npm

# or

yarn add @redux-devtools/rtk-query-inspector-monitor # yarn

```

### Usage

You can use `ChartMonitor` as the only monitor in your app:

##### `containers/DevTools.js`

```ts
import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import RtkQueryInspectorMonitor from '@redux-devtools/rtk-query-inspector-monitor';

export default createDevTools(<RtkQueryInspectorMonitor />);
```

Then you can render `<DevTools>` to any place inside app or even into a separate popup window.

Alternatively, you can use it together with [`DockMonitor`](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-dock-monitor) to make it dockable.  
Consult the [`DockMonitor` README](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-dock-monitor) for details of this approach.

[Read how to start using Redux DevTools.](https://github.com/reduxjs/redux-devtools)

#### Redux DevTools props

| Name          | Description                                                                                                                                                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`       | Either a string referring to one of the themes provided by [redux-devtools-themes](https://github.com/gaearon/redux-devtools-themes) (feel free to contribute!) or a custom object of the same format. Optional. By default, set to [`'nicinabox'`](https://github.com/gaearon/redux-devtools-themes/blob/master/src/nicinabox.js). |
| `invertTheme` | Boolean value that will invert the colors of the selected theme. Optional. By default, set to `false`                                                                                                                                                                                                                               |

### License

MIT
