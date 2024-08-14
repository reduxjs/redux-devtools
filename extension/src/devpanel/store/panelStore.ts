import { createStore, applyMiddleware, Reducer, Store } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  exportStateMiddleware,
  StoreAction,
  StoreState,
} from '@redux-devtools/app';
import panelDispatcher from './panelSyncMiddleware';
import rootReducer from './panelReducer';

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
  bgConnection: chrome.runtime.Port,
) {
  const enhancer = applyMiddleware(
    exportStateMiddleware,
    panelDispatcher(bgConnection),
  );
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store as Store);
  return { store, persistor };
}
