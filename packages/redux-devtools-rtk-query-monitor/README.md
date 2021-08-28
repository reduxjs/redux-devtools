# Redux DevTools RTK Query inspector monitor

A monitor that displays [RTK query](https://redux-toolkit.js.org/rtk-query/overview) queries and mutations for [Redux DevTools](https://github.com/gaearon/redux-devtools).

Created by [FaberVitale](https://github.com/FaberVitale), inspired by [react-query devtools](https://github.com/tannerlinsley/react-query/tree/master/devtools).

## Demo

- [link](https://rtk-query-monitor-demo.netlify.app/)
- [demo source](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-rtk-query-monitor/demo)

## Preview

![RTK Query inspector monitor demo](./monitor-demo.gif)

## Installation

### npm

```bash
npm i @redux-devtools/rtk-query-monitor --save
```

### yarn

```bash
yarn add @redux-devtools/rtk-query-monitor
```

## Usage

You can use `RtkQueryMonitor` as the only monitor in your app:

#### `containers/DevTools.js`

```ts
import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import RtkQueryrMonitor from '@redux-devtools/rtk-query-monitor';

export default createDevTools(<RtkQueryrMonitor />);
```

Then you can render `<DevTools>` to any place inside app or even into a separate popup window.

Alternatively, you can use it together with [`DockMonitor`](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-dock-monitor) to make it dockable.

### See also

- [`DockMonitor` README](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-dock-monitor)

- [Read how to start using Redux DevTools.](https://github.com/reduxjs/redux-devtools)

- [Redux Devtools walkthrough](https://github.com/reduxjs/redux-devtools/tree/master/docs/Walkthrough.md)

## Features

- sorts active queries and mutations in ascending or descending order by:
  - fulfilledTimeStamp
  - query key
  - query status
  - endpoint
  - api reducerPath
- filters active queries and mutations by:
  - fulfilledTimeStamp
  - query key
  - query status
  - endpoint
  - api reducerPath
- toggleable regular expression search
- Displays
  - status flags
  - query state
  - tags
  - subscriptions
  - api state
  - api stats
  - actions relevant to the selected query or mutation

## Redux DevTools props

| Name          | Description                                                                                                                                                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`       | Either a string referring to one of the themes provided by [redux-devtools-themes](https://github.com/gaearon/redux-devtools-themes) (feel free to contribute!) or a custom object of the same format. Optional. By default, set to [`'nicinabox'`](https://github.com/gaearon/redux-devtools-themes/blob/master/src/nicinabox.js). |
| `invertTheme` | Boolean value that will invert the colors of the selected theme. Optional. By default, set to `false`                                                                                                                                                                                                                               |

<br/>

### Development

#### Start Demo

```bash
yarn lerna run start --stream --scope @redux-devtools/rtk-query-monitor
```

<br/>

## License

[MIT](./LICENSE.md)
