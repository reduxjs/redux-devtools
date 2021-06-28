import { AnyAction, isAnyOf, isPlainObject } from '@reduxjs/toolkit';
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
  RtkQueryProvided,
  ApiTimings,
  QueryTimings,
  SelectorsSource,
} from '../types';
import { missingTagId } from '../monitor-config';
import { Comparator } from './comparators';
import { emptyArray } from './object';
import { formatMs } from './formatters';
import * as statistics from './statistics';

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
  subsState: RtkQueryApiState['subscriptions']
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

function computeQueryApiTimings(
  queriesOrMutations:
    | RtkQueryApiState['queries']
    | RtkQueryApiState['mutations']
): QueryTimings {
  type SpeedReport = { key: string | null; at: string | number };
  type DurationReport = { key: string | null; duration: string | number };
  let latestFetch: null | SpeedReport = { key: null, at: -1 };
  let oldestFetch: null | SpeedReport = {
    key: null,
    at: Number.MAX_SAFE_INTEGER,
  };
  let slowest: null | DurationReport = { key: null, duration: -1 };
  let fastest: null | DurationReport = {
    key: null,
    duration: Number.MAX_SAFE_INTEGER,
  };

  const pendingDurations: number[] = [];

  const queryKeys = Object.keys(queriesOrMutations);

  for (let i = 0, len = queryKeys.length; i < len; i++) {
    const queryKey = queryKeys[i];
    const query = queriesOrMutations[queryKey];

    const fulfilledTimeStamp = query?.fulfilledTimeStamp;
    const startedTimeStamp = query?.startedTimeStamp;

    if (typeof fulfilledTimeStamp === 'number') {
      if (fulfilledTimeStamp > latestFetch.at) {
        latestFetch.key = queryKey;
        latestFetch.at = fulfilledTimeStamp;
      }

      if (fulfilledTimeStamp < oldestFetch.at) {
        oldestFetch.key = queryKey;
        oldestFetch.at = fulfilledTimeStamp;
      }

      if (
        typeof startedTimeStamp === 'number' &&
        startedTimeStamp <= fulfilledTimeStamp
      ) {
        const pendingDuration = fulfilledTimeStamp - startedTimeStamp;

        pendingDurations.push(pendingDuration);

        if (pendingDuration > slowest.duration) {
          slowest.key = queryKey;
          slowest.duration = pendingDuration;
        }

        if (pendingDuration < fastest.duration) {
          fastest.key = queryKey;
          fastest.duration = pendingDuration;
        }
      }
    }
  }

  if (latestFetch.key !== null) {
    latestFetch.at = new Date(latestFetch.at).toISOString();
  } else {
    latestFetch = null;
  }

  if (oldestFetch.key !== null) {
    oldestFetch.at = new Date(oldestFetch.at).toISOString();
  } else {
    oldestFetch = null;
  }

  if (slowest.key !== null) {
    slowest.duration = formatMs(slowest.duration as number);
  } else {
    slowest = null;
  }

  if (fastest.key !== null) {
    fastest.duration = formatMs(fastest.duration as number);
  } else {
    fastest = null;
  }

  const average =
    pendingDurations.length > 0
      ? formatMs(statistics.mean(pendingDurations))
      : '-';

  const median =
    pendingDurations.length > 0
      ? formatMs(statistics.median(pendingDurations))
      : '-';

  return {
    latestFetch,
    oldestFetch,
    slowest,
    fastest,
    average,
    median,
  } as QueryTimings;
}

function computeApiTimings(api: RtkQueryApiState): ApiTimings {
  return {
    queries: computeQueryApiTimings(api.queries),
    mutations: computeQueryApiTimings(api.mutations),
  };
}

export function generateApiStatsOfCurrentQuery(
  api: RtkQueryApiState | null
): ApiStats | null {
  if (!api) {
    return null;
  }

  return {
    timings: computeApiTimings(api),
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
  provided: RtkQueryProvided | null
): RtkQueryTag[] {
  if (!queryInfo || !provided) {
    return emptyArray;
  }

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

/**
 * endpoint matcher
 * @param endpointName
 * @see https://github.com/reduxjs/redux-toolkit/blob/b718e01d323d3ab4b913e5d88c9b90aa790bb975/src/query/core/buildThunks.ts#L415
 */
export function matchesEndpoint(endpointName: unknown) {
  return (action: any): action is AnyAction =>
    endpointName != null && action?.meta?.arg?.endpointName === endpointName;
}

function matchesQueryKey(queryKey: string) {
  return (action: any): action is AnyAction =>
    action?.meta?.arg?.queryCacheKey === queryKey;
}

export function getActionsOfCurrentQuery(
  currentQuery: QueryInfo | null,
  actionById: SelectorsSource<unknown>['actionsById']
): AnyAction[] {
  if (!currentQuery) {
    return emptyArray;
  }

  const matcher = isAnyOf(matchesQueryKey(currentQuery.queryKey));

  const output: AnyAction[] = [];

  for (const [, liftedAction] of Object.entries(actionById)) {
    if (matcher(liftedAction?.action)) {
      output.push(liftedAction.action);
    }
  }

  return output.length === 0 ? emptyArray : output;
}
