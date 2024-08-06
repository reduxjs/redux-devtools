import {
  configureStore,
  combineReducers,
  EnhancedStore,
} from '@reduxjs/toolkit';
import { pokemonApi } from './services/pokemon';
import { postsApi } from './services/posts';
import DevTools from './features/DevTools/DevTools';
import { isExtensionEnabled } from './features/DevTools/helpers';

const devTools = isExtensionEnabled();

const reducer = combineReducers({
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
});

export const store: EnhancedStore<ReturnType<typeof reducer>> = configureStore({
  reducer,
  devTools,
  // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([pokemonApi.middleware, postsApi.middleware]),
  enhancers: (devTools ? [] : [DevTools.instrument()]) as any,
});
