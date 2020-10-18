import { createStore, compose, applyMiddleware, Store } from 'redux';
import localForage from 'localforage';
import {
  getStoredState,
  createPersistor,
  PersistorConfig,
} from 'redux-persist';
import api from '../middlewares/api';
import exportState from '../middlewares/exportState';
import rootReducer, { StoreState } from '../reducers';
import { StoreAction } from '../actions';

export default function configureStore(
  callback: (
    store: Store<StoreState, StoreAction>,
    restoredState: Partial<StoreState> | undefined
  ) => void,
  key?: string
) {
  const persistConfig: PersistorConfig = ({
    keyPrefix: `redux-devtools${key || ''}:`,
    blacklist: ['instances', 'socket'],
    storage: localForage,
    serialize: (data: unknown) => data,
    deserialize: (data: unknown) => data,
  } as unknown) as PersistorConfig;

  getStoredState<StoreState>(persistConfig, (err, restoredState) => {
    let composeEnhancers = compose;
    if (process.env.NODE_ENV !== 'production') {
      if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
      }
      if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
          const nextReducer = require('../reducers'); // eslint-disable-line global-require
          store.replaceReducer(nextReducer);
        });
      }
    }

    const store = createStore(
      rootReducer,
      restoredState,
      composeEnhancers(applyMiddleware(exportState, api))
    );
    const persistor = createPersistor(store, persistConfig);
    callback(store, restoredState);
    if (err) persistor.purge();
  });
}
