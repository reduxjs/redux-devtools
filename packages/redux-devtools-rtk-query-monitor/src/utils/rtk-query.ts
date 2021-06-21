import { isPlainObject } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import {
  QueryInfo,
  RtkQueryMonitorState,
  RtkQueryApiState,
  RTKQuerySubscribers,
  RtkQueryTag,
  RTKStatusFlags,
  RtkQueryState,
  MutationInfo,
  ApiStats,
  QueryTally,
} from '../types';
import { missingTagId } from '../monitor-config';
import { Comparator } from './comparators';
import { emptyArray } from './object';
import { SubscriptionState } from '@reduxjs/toolkit/dist/query/core/apiState';

const rtkqueryApiStateKeys: ReadonlyArray<keyof RtkQueryApiState> = [
  'queries',
  'mutations',
  'config',
  'provided',
  'subscriptions',
];

/**
 * Type guard used to select apis from the user store state.
 * @param val
 * @returns {boolean}
 */
export function isApiSlice(val: unknown): val is RtkQueryApiState {
  if (!isPlainObject(val)) {
    return false;
  }

  for (let i = 0, len = rtkqueryApiStateKeys.length; i < len; i++) {
    if (
      !isPlainObject((val as Record<string, unknown>)[rtkqueryApiStateKeys[i]])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Indexes api states by their `reducerPath`.
 *
 * Returns `null` if there are no api slice or `reduxStoreState`
 * is not an object.
 *
 * @param reduxStoreState
 * @returns
 */
export function getApiStatesOf(
  reduxStoreState: unknown
): null | Readonly<Record<string, RtkQueryApiState>> {
  if (!isPlainObject(reduxStoreState)) {
    return null;
  }

  const output: null | Record<string, RtkQueryApiState> = {};
  const keys = Object.keys(reduxStoreState);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const value = (reduxStoreState as Record<string, unknown>)[key];

    if (isApiSlice(value)) {
      output[key] = value;
    }
  }

  if (Object.keys(output).length === 0) {
    return null;
  }

  return output;
}

export function extractAllApiQueries(
  apiStatesByReducerPath: null | Readonly<Record<string, RtkQueryApiState>>
): ReadonlyArray<QueryInfo> {
  if (!apiStatesByReducerPath) {
    return emptyArray;
  }

  const reducerPaths = Object.keys(apiStatesByReducerPath);

  const output: QueryInfo[] = [];

  for (let i = 0, len = reducerPaths.length; i < len; i++) {
    const reducerPath = reducerPaths[i];
    const api = apiStatesByReducerPath[reducerPath];
    const queryKeys = Object.keys(api.queries);

    for (let j = 0, qKeysLen = queryKeys.length; j < qKeysLen; j++) {
      const queryKey = queryKeys[j];
      const query = api.queries[queryKey];

      if (query) {
        output.push({
          reducerPath,
          queryKey,
          query,
        });
      }
    }
  }

  return output;
}

export function extractAllApiMutations(
  apiStatesByReducerPath: null | Readonly<Record<string, RtkQueryApiState>>
): ReadonlyArray<MutationInfo> {
  if (!apiStatesByReducerPath) {
    return emptyArray;
  }

  const reducerPaths = Object.keys(apiStatesByReducerPath);
  const output: MutationInfo[] = [];

  for (let i = 0, len = reducerPaths.length; i < len; i++) {
    const reducerPath = reducerPaths[i];
    const api = apiStatesByReducerPath[reducerPath];
    const mutationKeys = Object.keys(api.mutations);

    for (let j = 0, mKeysLen = mutationKeys.length; j < mKeysLen; j++) {
      const queryKey = mutationKeys[j];
      const mutation = api.queries[queryKey];

      if (mutation) {
        output.push({
          reducerPath,
          queryKey,
          mutation,
        });
      }
    }
  }

  return output;
}

function computeQueryTallyOf(
  queryState: RtkQueryApiState['queries'] | RtkQueryApiState['mutations']
): QueryTally {
  const queries = Object.values(queryState);

  const output: QueryTally = {
    count: 0,
  };

  for (let i = 0, len = queries.length; i < len; i++) {
    const query = queries[i];

    if (query) {
      output.count++;

      if (!output[query.status]) {
        output[query.status] = 1;
      } else {
        (output[query.status] as number)++;
      }
    }
  }

  return output;
}

function tallySubscriptions(
  subsState: SubscriptionState
): ApiStats['tally']['subscriptions'] {
  const subsOfQueries = Object.values(subsState);

  const output: ApiStats['tally']['subscriptions'] = {
    count: 0,
  };

  for (let i = 0, len = subsOfQueries.length; i < len; i++) {
    const subsOfQuery = subsOfQueries[i];

    if (subsOfQuery) {
      output.count += Object.keys(subsOfQuery).length;
    }
  }

  return output;
}

export function generateApiStatsOfCurrentQuery(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>
): ApiStats | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  const { reducerPath } = queryInfo;
  const api = apiStates[reducerPath];

  return {
    tally: {
      subscriptions: tallySubscriptions(api.subscriptions),
      queries: computeQueryTallyOf(api.queries),
      tagTypes: { count: Object.keys(api.provided).length },
      mutations: computeQueryTallyOf(api.mutations),
    },
  };
}

export function flipComparator<T>(comparator: Comparator<T>): Comparator<T> {
  return function flipped(a: T, b: T) {
    return comparator(b, a);
  };
}

export function isQuerySelected(
  selectedQueryKey: RtkQueryMonitorState['selectedQueryKey'],
  queryInfo: QueryInfo
): boolean {
  return (
    !!selectedQueryKey &&
    selectedQueryKey.queryKey === queryInfo.queryKey &&
    selectedQueryKey.reducerPath === queryInfo.reducerPath
  );
}

export function getApiStateOf(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>
): RtkQueryApiState | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  return apiStates[queryInfo.reducerPath] ?? null;
}

export function getQuerySubscriptionsOf(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>
): RTKQuerySubscribers | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  return (
    apiStates[queryInfo.reducerPath]?.subscriptions?.[queryInfo.queryKey] ??
    null
  );
}

export function getProvidedOf(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>
): RtkQueryApiState['provided'] | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  return apiStates[queryInfo.reducerPath]?.provided ?? null;
}

export function getQueryTagsOf(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>
): RtkQueryTag[] {
  if (!apiStates || !queryInfo) {
    return emptyArray;
  }

  const provided = apiStates[queryInfo.reducerPath].provided;

  const tagTypes = Object.keys(provided);

  if (tagTypes.length < 1) {
    return emptyArray;
  }

  const output: RtkQueryTag[] = [];

  for (const [type, tagIds] of Object.entries(provided)) {
    if (tagIds) {
      for (const [id, queryKeys] of Object.entries(tagIds)) {
        if ((queryKeys as unknown[]).includes(queryInfo.queryKey)) {
          const tag: RtkQueryTag = { type };

          if (id !== missingTagId) {
            tag.id = id;
          }

          output.push(tag);
        }
      }
    }
  }

  return output;
}

/**
 * Computes query status flags.
 * @param status
 * @see https://redux-toolkit.js.org/rtk-query/usage/queries#frequently-used-query-hook-return-values
 * @see https://github.com/reduxjs/redux-toolkit/blob/b718e01d323d3ab4b913e5d88c9b90aa790bb975/src/query/core/apiState.ts#L63
 */
export function getQueryStatusFlags({
  status,
  data,
}: RtkQueryState): RTKStatusFlags {
  return {
    isUninitialized: status === QueryStatus.uninitialized,
    isFetching: status === QueryStatus.pending,
    isSuccess: status === QueryStatus.fulfilled && !!data,
    isError: status === QueryStatus.rejected,
  };
}
