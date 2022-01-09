# Redux DevTools Test Generator

### Installation

```
yarn add @redux-devtools/inspector-monitor-test-tab
```

### Usage

If you use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension), [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev), it's already there, and no additional actions required.

With [`redux-devtools`](https://github.com/reduxjs/redux-devtools) and [`redux-devtools-inspector-monitor`](https://github.com/reduxjs/redux-devtools/packages/redux-devtools-inspector-monitor):

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import { InspectorMonitor } from '@redux-devtools/inspector-monitor';
import { TestTab, reduxMochaTemplate } from '@redux-devtools/inspector-monitor-test-tab'; // If using default tests.

const testComponent = (props) => (
  <TestTab
    expect={reduxMochaTemplate.expect} wrap={reduxMochaTemplate.wrap} useCodemirror
    {...props}
  />
);

export default createDevTools(
  <InspectorMonitor
    tabs: defaultTabs => [...defaultTabs, { name: 'Test', component: testComponent }]
  />
);
```

Instead of `mochaTemplate.expect` and `mochaTemplate.wrap` you can use your function templates.

If `useCodemirror` specified, include `codemirror/lib/codemirror.css` style and optionally themes from `codemirror/theme/`.

### Props

| Name              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `assertion`       | String template or function with an object argument containing `action`, `prevState`, `curState` keys, which returns a string representing the assertion (see the [function](https://github.com/reduxjs/redux-devtools/blob/master/packages/redux-devtools-inspector-monitor-test-tab/src/redux/mocha/index.ts#L8-L9) or [template](https://github.com/reduxjs/redux-devtools/blob/master/packages/redux-devtools-inspector-monitor-test-tab/src/redux/mocha/template.ts#L5)). |
| [`wrap`]          | Optional string template or function which gets `assertions` argument and returns a string (see the example [function](https://github.com/reduxjs/redux-devtools/blob/master/packages/redux-devtools-inspector-monitor-test-tab/src/redux/mocha/index.ts#L11-L13) or [template](https://github.com/reduxjs/redux-devtools/blob/master/packages/redux-devtools-inspector-monitor-test-tab/src/redux/mocha/template.ts#L7-L8)).                                                  |
| [`useCodemirror`] | Boolean. If specified will use codemirror styles.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [`theme`]         | String. Name of [the codemirror theme](https://codemirror.net/demo/theme.html).                                                                                                                                                                                                                                                                                                                                                                                                |

### License

MIT
