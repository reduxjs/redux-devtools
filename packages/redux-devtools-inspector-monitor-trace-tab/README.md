# Redux DevTools Stack Trace Monitor

Submonitor for Redux DevTools inspector to show stack traces. Based on [`react-error-overlay`](https://github.com/facebook/create-react-app/tree/master/packages/react-error-overlay) and the contribution of [Mark Erikson](https://github.com/markerikson) in [the PR from `remotedev-app`](https://github.com/zalmoxisus/remotedev-app/pull/43/).

It's integrated in Redux DevTools browser extension. To use it separately with [`redux-devtools`](https://github.com/reduxjs/redux-devtools/packages/redux-devtools) and [`redux-devtools-inspector-monitor`](https://github.com/reduxjs/redux-devtools/packages/redux-devtools-inspector-monitor) according to [Walkthrough](https://github.com/reduxjs/redux-devtools/blob/master/docs/Walkthrough.md):

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import { InspectorMonitor } from '@redux-devtools/inspector-monitor';
import { TraceTab } from '@redux-devtools/inspector-monitor-trace-tab';

export default createDevTools(
  <InspectorMonitor
    tabs: defaultTabs => [...defaultTabs, { name: 'Trace', component: TraceTab }]
  />
);
```

##### `store/configureStore.js`

```js
// ...
const enhancer = compose(
  // ...
  DevTools.instrument({ trace: true }),
);
// ...
```

### License

MIT
