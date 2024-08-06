import { middlewares } from '@redux-devtools/app-core';
import { createStore, compose, applyMiddleware, Reducer, Store } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import { api } from '../middlewares/api';
import { StoreState, rootReducer } from '../reducers';
import { StoreAction } from '../actions';

const persistConfig = {
  key: 'redux-devtools',
  blacklist: ['instances', 'socket'],
  storage: localForage,
};

const persistedReducer: Reducer<StoreState, StoreAction> = persistReducer(
  persistConfig,
  rootReducer as unknown as Reducer<StoreState, StoreAction>,
) as any;

export default function configureStore(
  callback: (store: Store<StoreState, StoreAction>) => void,
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
  }

  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middlewares, api)),
  );
  const persistor = persistStore(store as Store, null, () => {
    callback(store);
  });
  return { store, persistor };
}
