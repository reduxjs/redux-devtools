import { createStore, applyMiddleware, PreloadedState, Reducer } from 'redux';
import localForage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';
import exportState from '@redux-devtools/app/lib/middlewares/exportState';
import panelDispatcher from '../middlewares/panelSync';
import rootReducer, { StoreStateWithoutSocket } from '../reducers/panel';
import { StoreAction } from '@redux-devtools/app/lib/actions';

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
  const enhancer = applyMiddleware(exportState, panelDispatcher(bgConnection));
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
