import { createStore, compose, applyMiddleware, Reducer, Store } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import api from '../middlewares/api';
import exportState from '../middlewares/exportState';
import rootReducer, { StoreState } from '../reducers';
import { StoreAction } from '../actions';

const persistConfig = {
  key: 'redux-devtools',
  blacklist: ['instances', 'socket'],
  storage: localForage,
};

const persistedReducer: Reducer<StoreState, StoreAction> = persistReducer(
  persistConfig,
  rootReducer
) as any;

export default function configureStore(
  callback: (store: Store<StoreState, StoreAction>) => void
) {
  let composeEnhancers = compose;
  if (process.env.NODE_ENV !== 'production') {
    if (
      (
        window as unknown as {
          __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        }
      ).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ) {
      composeEnhancers = (
        window as unknown as {
          __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
        }
      ).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nextReducer = require('../reducers'); // eslint-disable-line global-require
        store.replaceReducer(nextReducer);
      });
    }
  }

  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(exportState, api))
  );
  const persistor = persistStore(store, null, () => {
    callback(store);
  });
  return { store, persistor };
}
