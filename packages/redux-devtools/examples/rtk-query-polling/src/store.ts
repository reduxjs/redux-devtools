import { configureStore } from '@reduxjs/toolkit'
import { pokemonApi } from './services/pokemon'
import devToolsEnhancer from 'remote-redux-devtools';


export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  devTools: false,
  // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  enhancers : [devToolsEnhancer({ port: 8000, hostname: 'localhost' })]
})
