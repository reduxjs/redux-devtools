import { createStore, applyMiddleware, Reducer, Store } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  exportStateMiddleware,
  parseErrorMiddleware,
  StoreAction,
  StoreState,
} from '@redux-devtools/app';
import panelDispatcher, { PanelBackgroundPort } from './panelSyncMiddleware.js';
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
