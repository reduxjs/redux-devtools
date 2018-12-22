Redux DevTools Test Generator
==============================

### Installation

```
npm install --save-dev redux-devtools-test-generator
```

### Usage

If you use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension), [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev), it's already there, and no additional actions required. 

With [`redux-devtools`](https://github.com/reduxjs/redux-devtools) and [`redux-devtools-inspector`](https://github.com/reduxjs/redux-devtools/packages/redux-devtools-inspector):

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import Inspector from 'redux-devtools-inspector';
import TestGenerator from 'redux-devtools-test-generator';
import mochaTemplate from 'redux-devtools-test-generator/lib/redux/mocha'; // If using default tests.

const testComponent = (props) => (
  <TestGenerator
    expect={mochaTemplate.expect} wrap={mochaTemplate.wrap} useCodemirror
    {...props}
  />
);

export default createDevTools(
  <Inspector
    tabs: defaultTabs => [...defaultTabs, { name: 'Test', component: testComponent }]
  />
);
```

Instead of `mochaTemplate.expect` and `mochaTemplate.wrap` you can use your function templates.

If `useCodemirror` specified, include `codemirror/lib/codemirror.css` style and optionally themes from `codemirror/theme/`.

### Props

Name                  | Description
-------------         | -------------
`assertion`           | String template or function with an object argument containing `action`, `prevState`, `curState` keys, which returns a string representing the assertion (see the [function](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha/index.js#L1-L3) or [template](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha/template.js#L1)).
[`wrap`]              | Optional string template or function which gets `assertions` argument and returns a string (see the example [function](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha/index.js#L5-L14) or [template](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha/template.js#L3-L12)).
[`useCodemirror`]     | Boolean. If specified will use codemirror styles.
[`theme`]             | String. Name of [the codemirror theme](https://codemirror.net/demo/theme.html).

### License

MIT
