# Redux DevTools monitor app core

The core React component and Redux store for the Redux DevTools monitor app. It is split out to allow you to use it directly for transports other than the standard WebSocket one.

### Usage

```js
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from '@redux-devtools/app-core';
import { store, persistor } from "./yourStore";

export function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor!}>
        <App />
      </PersistGate>
    </Provider>
  );
}
```

### License

MIT
