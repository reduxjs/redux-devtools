import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './services/pokemon';
import devToolsEnhancer from 'remote-redux-devtools';

const remotePort = Number(process.env.REACT_APP_REMOTE_DEV_TOOLS_PORT) ?? 8000;
const remoteHostname =
  process.env.REACT_APP_REMOTE_DEV_TOOLS_HOST ?? 'localhost';

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  devTools: false,
  // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  enhancers: [devToolsEnhancer({ port: remotePort, hostname: remoteHostname })],
});
