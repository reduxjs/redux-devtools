import { Action, AnyAction, isAllOf, isPlainObject } from '@reduxjs/toolkit';
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
  RtkMutationState,
  RtkResourceInfo,
  RtkRequest,
  RtkRequestTiming,
} from '../types';
import { missingTagId } from '../monitor-config';
import { Comparator, compareJSONPrimitive } from './comparators';
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
  reduxStoreState: unknown,
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
  apiStatesByReducerPath: null | Readonly<Record<string, RtkQueryApiState>>,
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
      const state = api.queries[queryKey];

      if (state) {
        output.push({
          type: 'query',
          reducerPath,
          queryKey,
          state,
        });
      }
    }
  }

  return output;
}

export function extractAllApiMutations(
  apiStatesByReducerPath: null | Readonly<Record<string, RtkQueryApiState>>,
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
      const state = api.mutations[queryKey];

      if (state) {
        output.push({
          type: 'mutation',
          reducerPath,
          queryKey,
          state,
        });
      }
    }
  }

  return output;
}

function computeQueryTallyOf(
  queryState: RtkQueryApiState['queries'] | RtkQueryApiState['mutations'],
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
  subsState: RtkQueryApiState['subscriptions'],
): number {
  const subsOfQueries = Object.values(subsState);

  let output = 0;

  for (let i = 0, len = subsOfQueries.length; i < len; i++) {
    const subsOfQuery = subsOfQueries[i];

    if (subsOfQuery) {
      output += Object.keys(subsOfQuery).length;
    }
  }

  return output;
}

function computeRtkQueryRequests(
  type: 'queries' | 'mutations',
  api: RtkQueryApiState,
  sortedActions: AnyAction[],
  currentStateIndex: SelectorsSource<unknown>['currentStateIndex'],
): Readonly<Record<string, RtkRequest>> {
  const requestById: Record<string, RtkRequest> = {};

  const matcher =
    type === 'queries'
      ? matchesExecuteQuery(api.config.reducerPath)
      : matchesExecuteMutation(api.config.reducerPath);

  for (
    let i = 0, len = sortedActions.length;
    i < len && i <= currentStateIndex;
    i++
  ) {
    const action = sortedActions[i];

    if (matcher(action)) {
      let requestRecord: RtkRequest | undefined =
        requestById[action.meta.requestId];

      if (!requestRecord) {
        const queryCacheKey: string | undefined = (
          action.meta as Record<string, any>
        )?.arg?.queryCacheKey;

        const queryKey =
          typeof queryCacheKey === 'string'
            ? queryCacheKey
            : action.meta.requestId;

        const endpointName: string =
          (action.meta as any)?.arg?.endpointName ?? '-';

        requestById[action.meta.requestId] = requestRecord = {
          queryKey,
          requestId: action.meta.requestId,
          endpointName,
          status: action.meta.requestStatus,
        };
      }

      requestRecord.status = action.meta.requestStatus;

      if (
        action.meta.requestStatus === QueryStatus.pending &&
        typeof (action.meta as any).startedTimeStamp === 'number'
      ) {
        requestRecord.startedTimeStamp = (action.meta as any).startedTimeStamp;
      }

      if (
        action.meta.requestStatus === QueryStatus.fulfilled &&
        typeof (action.meta as any).fulfilledTimeStamp === 'number'
      ) {
        requestRecord.fulfilledTimeStamp = (
          action.meta as any
        ).fulfilledTimeStamp;
      }
    }
  }

  const requestIds = Object.keys(requestById);

  // Patch queries that have pending actions that are committed
  for (let i = 0, len = requestIds.length; i < len; i++) {
    const requestId = requestIds[i];
    const request = requestById[requestId];

    if (
      typeof request.startedTimeStamp === 'undefined' &&
      typeof request.fulfilledTimeStamp === 'number'
    ) {
      const startedTimeStampFromCache =
        api[type][request.queryKey]?.startedTimeStamp;

      if (typeof startedTimeStampFromCache === 'number') {
        request.startedTimeStamp = startedTimeStampFromCache;
      }
    }
  }

  // Add queries that have pending and fulfilled actions committed
  const queryCacheEntries = Object.entries(api[type] ?? {});

  for (let i = 0, len = queryCacheEntries.length; i < len; i++) {
    const [queryCacheKey, queryCache] = queryCacheEntries[i];
    const requestId: string =
      type === 'queries'
        ? ((queryCache as (typeof api)['queries'][string])?.requestId ?? '')
        : queryCacheKey;
    if (
      queryCache &&
      !Object.prototype.hasOwnProperty.call(requestById, requestId)
    ) {
      const startedTimeStamp = queryCache?.startedTimeStamp;
      const fulfilledTimeStamp = queryCache?.fulfilledTimeStamp;

      if (
        typeof startedTimeStamp === 'number' &&
        typeof fulfilledTimeStamp === 'number'
      ) {
        requestById[requestId] = {
          queryKey: queryCacheKey,
          requestId,
          endpointName: queryCache.endpointName ?? '',
          startedTimeStamp,
          fulfilledTimeStamp,
          status: queryCache.status,
        };
      }
    }
  }

  return requestById;
}

function formatRtkRequest(
  rtkRequest: RtkRequest | null,
): RtkRequestTiming | null {
  if (!rtkRequest) {
    return null;
  }

  const fulfilledTimeStamp = rtkRequest.fulfilledTimeStamp;
  const startedTimeStamp = rtkRequest.startedTimeStamp;

  const output: RtkRequestTiming = {
    queryKey: rtkRequest.queryKey,
    requestId: rtkRequest.requestId,
    endpointName: rtkRequest.endpointName,
    startedAt: '-',
    completedAt: '-',
    duration: '-',
  };

  if (
    typeof fulfilledTimeStamp === 'number' &&
    typeof startedTimeStamp === 'number'
  ) {
    output.startedAt = new Date(startedTimeStamp).toISOString();
    output.completedAt = new Date(fulfilledTimeStamp).toISOString();
    output.duration = formatMs(fulfilledTimeStamp - startedTimeStamp);
  }

  return output;
}

function computeQueryApiTimings(
  requestById: Readonly<Record<string, RtkRequest>>,
): QueryTimings {
  const requests = Object.values(requestById);

  let latestRequest: RtkRequest | null = null;
  let oldestRequest: null | RtkRequest = null;
  let slowestRequest: RtkRequest | null = null;
  let fastestRequest: RtkRequest | null = null;
  let slowestDuration = 0;
  let fastestDuration = Number.MAX_SAFE_INTEGER;

  const pendingDurations: number[] = [];

  for (let i = 0, len = requests.length; i < len; i++) {
    const request = requests[i];
    const { fulfilledTimeStamp, startedTimeStamp } = request;

    if (typeof fulfilledTimeStamp === 'number') {
      const latestFulfilledTimeStamp = latestRequest?.fulfilledTimeStamp || 0;
      const oldestFulfilledTimeStamp =
        oldestRequest?.fulfilledTimeStamp || Number.MAX_SAFE_INTEGER;

      if (fulfilledTimeStamp > latestFulfilledTimeStamp) {
        latestRequest = request;
      }

      if (fulfilledTimeStamp < oldestFulfilledTimeStamp) {
        oldestRequest = request;
      }

      if (
        typeof startedTimeStamp === 'number' &&
        startedTimeStamp <= fulfilledTimeStamp
      ) {
        const pendingDuration = fulfilledTimeStamp - startedTimeStamp;
        pendingDurations.push(pendingDuration);

        if (pendingDuration > slowestDuration) {
          slowestDuration = pendingDuration;
          slowestRequest = request;
        }

        if (pendingDuration < fastestDuration) {
          fastestDuration = pendingDuration;
          fastestRequest = request;
        }
      }
    }
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
    latest: formatRtkRequest(latestRequest),
    oldest: formatRtkRequest(oldestRequest),
    slowest: formatRtkRequest(slowestRequest),
    fastest: formatRtkRequest(fastestRequest),
    average,
    median,
  };
}

function computeApiTimings(
  api: RtkQueryApiState,
  actionsById: SelectorsSource<unknown>['actionsById'],
  currentStateIndex: SelectorsSource<unknown>['currentStateIndex'],
): ApiTimings {
  const sortedActions = Object.entries(actionsById)
    .sort((thisAction, thatAction) =>
      compareJSONPrimitive(Number(thisAction[0]), Number(thatAction[0])),
    )
    .map((entry) => entry[1].action);

  const queryRequestsById = computeRtkQueryRequests(
    'queries',
    api,
    sortedActions,
    currentStateIndex,
  );

  const mutationRequestsById = computeRtkQueryRequests(
    'mutations',
    api,
    sortedActions,
    currentStateIndex,
  );

  return {
    queries: computeQueryApiTimings(queryRequestsById),
    mutations: computeQueryApiTimings(mutationRequestsById),
  };
}

export function generateApiStatsOfCurrentQuery(
  api: RtkQueryApiState | null,
  actionsById: SelectorsSource<unknown>['actionsById'],
  currentStateIndex: SelectorsSource<unknown>['currentStateIndex'],
): ApiStats | null {
  if (!api) {
    return null;
  }

  return {
    timings: computeApiTimings(api, actionsById, currentStateIndex),
    tally: {
      cachedQueries: computeQueryTallyOf(api.queries),
      cachedMutations: computeQueryTallyOf(api.mutations),
      tagTypes: Object.keys(api.provided).length,
      subscriptions: tallySubscriptions(api.subscriptions),
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
  queryInfo: RtkResourceInfo,
): boolean {
  return (
    !!selectedQueryKey &&
    selectedQueryKey.queryKey === queryInfo.queryKey &&
    selectedQueryKey.reducerPath === queryInfo.reducerPath
  );
}

export function getApiStateOf(
  queryInfo: RtkResourceInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>,
): RtkQueryApiState | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  return apiStates[queryInfo.reducerPath] ?? null;
}

export function getQuerySubscriptionsOf(
  queryInfo: QueryInfo | null,
  apiStates: ReturnType<typeof getApiStatesOf>,
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
  apiStates: ReturnType<typeof getApiStatesOf>,
): RtkQueryApiState['provided'] | null {
  if (!apiStates || !queryInfo) {
    return null;
  }

  return apiStates[queryInfo.reducerPath]?.provided ?? null;
}

export function getQueryTagsOf(
  resInfo: RtkResourceInfo | null,
  provided: RtkQueryProvided | null,
): RtkQueryTag[] {
  if (!resInfo || resInfo.type === 'mutation' || !provided) {
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
        if ((queryKeys as unknown[]).includes(resInfo.queryKey)) {
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
}: RtkQueryState | RtkMutationState): RTKStatusFlags {
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
  return (action: any): action is Action =>
    endpointName != null && action?.meta?.arg?.endpointName === endpointName;
}

function matchesQueryKey(queryKey: string) {
  return (action: any): action is Action =>
    action?.meta?.arg?.queryCacheKey === queryKey;
}

function macthesRequestId(requestId: string) {
  return (action: any): action is Action =>
    action?.meta?.requestId === requestId;
}

function matchesReducerPath(reducerPath: string) {
  return (action: any): action is Action<string> =>
    typeof action?.type === 'string' && action.type.startsWith(reducerPath);
}

function matchesExecuteQuery(reducerPath: string) {
  return (
    action: any,
  ): action is Action<string> & {
    meta: { requestId: string; requestStatus: QueryStatus };
  } => {
    return (
      typeof action?.type === 'string' &&
      action.type.startsWith(`${reducerPath}/executeQuery`) &&
      typeof action.meta?.requestId === 'string' &&
      typeof action.meta?.requestStatus === 'string'
    );
  };
}

function matchesExecuteMutation(reducerPath: string) {
  return (
    action: any,
  ): action is Action<string> & {
    meta: { requestId: string; requestStatus: QueryStatus };
  } =>
    typeof action?.type === 'string' &&
    action.type.startsWith(`${reducerPath}/executeMutation`) &&
    typeof action.meta?.requestId === 'string' &&
    typeof action.meta?.requestStatus === 'string';
}

export function getActionsOfCurrentQuery(
  currentQuery: RtkResourceInfo | null,
  actionById: SelectorsSource<unknown>['actionsById'],
): Action[] {
  if (!currentQuery) {
    return emptyArray;
  }

  let matcher: ReturnType<typeof macthesRequestId>;

  if (currentQuery.type === 'mutation') {
    matcher = isAllOf(
      matchesReducerPath(currentQuery.reducerPath),
      macthesRequestId(currentQuery.queryKey),
    );
  } else {
    matcher = isAllOf(
      matchesReducerPath(currentQuery.reducerPath),
      matchesQueryKey(currentQuery.queryKey),
    );
  }

  const output: AnyAction[] = [];

  for (const [, liftedAction] of Object.entries(actionById)) {
    if (matcher(liftedAction?.action)) {
      output.push(liftedAction.action);
    }
  }

  return output.length === 0 ? emptyArray : output;
}
