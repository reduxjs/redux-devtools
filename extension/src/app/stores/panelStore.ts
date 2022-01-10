import { createStore, applyMiddleware, Reducer } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import { exportStateMiddleware, StoreAction } from '@redux-devtools/app';
import panelDispatcher from '../middlewares/panelSync';
import rootReducer, { StoreStateWithoutSocket } from '../reducers/panel';

const persistConfig = {
  key: 'redux-devtools',
  blacklist: ['instances', 'socket'],
  storage: localForage,
};

const persistedReducer: Reducer<StoreStateWithoutSocket, StoreAction> =
  persistReducer(persistConfig, rootReducer) as any;

export default function configureStore(
  position: string,
  bgConnection: chrome.runtime.Port
) {
  const enhancer = applyMiddleware(
    exportStateMiddleware,
    panelDispatcher(bgConnection)
  );
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
