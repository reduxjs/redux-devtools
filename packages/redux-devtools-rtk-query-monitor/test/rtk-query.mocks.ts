import {
  combineReducers,
  configureStore,
  EnhancedStore,
  Middleware,
  Tuple,
} from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import type { ReduxDevTools } from './devtools.mocks';

export type MockBaseQuery<
  Result,
  Args = string | FetchArgs,
  Meta = { status?: number },
> = BaseQueryFn<Args, Result, unknown, Meta>;

export type BaseQueryJestMockFunction<Result> = jest.Mock<
  ReturnType<MockBaseQuery<Result>>,
  Parameters<MockBaseQuery<Result>>
>;

export function createMockBaseQuery<Result>(
  jestMockFn: BaseQueryJestMockFunction<Result>,
): MockBaseQuery<Result> {
  return async function mockBaseQuery(param, api, extra) {
    try {
      const output = await jestMockFn(param, api, extra);

      return output;
    } catch (error) {
      return {
        error,
      };
    }
  };
}

export function createPokemonApi(
  jestMockFn: BaseQueryJestMockFunction<Record<string, any>>,
) {
  return createApi({
    reducerPath: 'pokemonApi',
    keepUnusedDataFor: 9999,
    baseQuery: createMockBaseQuery(jestMockFn),
    tagTypes: ['pokemon'],
    endpoints: (builder) => ({
      getPokemonByName: builder.query<Record<string, any>, string>({
        query: (name: string) => `pokemon/${name}`,
        providesTags: (result, error, name: string) => [
          { type: 'pokemon' },
          { type: 'pokemon', id: name },
        ],
      }),
    }),
  });
}

export function setupStore(
  jestMockFn: BaseQueryJestMockFunction<Record<string, any>>,
  devTools: typeof ReduxDevTools,
) {
  const pokemonApi = createPokemonApi(jestMockFn);

  const reducer = combineReducers({
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  });

  const store: EnhancedStore<ReturnType<typeof reducer>> = configureStore({
    reducer,
    devTools: false,
    // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(devTools.instrument()),
  });

  return {
    jestMockFn,
    devTools,
    store,
    reducer,
    pokemonApi,
  };
}
