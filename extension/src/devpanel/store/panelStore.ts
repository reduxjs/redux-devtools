import type { Reducer, Store } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import type { StoreAction, StoreState } from '@redux-devtools/app';
import {
  exportStateMiddleware,
  parseErrorMiddleware,
} from '@redux-devtools/app';
import type { PanelBackgroundPort } from './panelSyncMiddleware.js';
import panelDispatcher from './panelSyncMiddleware.js';
import rootReducer from './panelReducer.js';

const persistConfig = {
  key: 'redux-devtools',
  blacklist: ['instances', 'socket'],
  storage: localForage,
};

const persistedReducer: Reducer<StoreState, StoreAction> = persistReducer(
  persistConfig,
  rootReducer,
) as any;

export default function configureStore(
  position: string,
  bgConnection: PanelBackgroundPort,
) {
  const enhancer = applyMiddleware(
    parseErrorMiddleware,
    exportStateMiddleware,
    panelDispatcher(bgConnection),
  );
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store as Store);
  return { store, persistor };
}
