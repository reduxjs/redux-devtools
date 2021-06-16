import { isPlainObject } from '@reduxjs/toolkit';
import {
  QueryInfo,
  RtkQueryInspectorMonitorState,
  RtkQueryApiState,
  RTKQuerySubscribers,
  RtkQueryTag,
} from '../types';
import { missingTagId } from '../monitor-config';
import { Comparator } from './comparators';
import { emptyArray } from './object';

const rtkqueryApiStateKeys: ReadonlyArray<keyof RtkQueryApiState> = [
  'queries',
  'mutations',
  'config',
  'provided',
  'subscriptions',
];

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

export function getApiStatesOf(
  state: unknown
): null | Readonly<Record<string, RtkQueryApiState>> {
  if (!isPlainObject(state)) {
    return null;
  }

  const output: null | Record<string, RtkQueryApiState> = {};
  const keys = Object.keys(state);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const value = (state as Record<string, unknown>)[key];

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

export function flipComparator<T>(comparator: Comparator<T>): Comparator<T> {
  return function flipped(a: T, b: T) {
    return comparator(b, a);
  };
}

export function isQuerySelected(
  selectedQueryKey: RtkQueryInspectorMonitorState['selectedQueryKey'],
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
        if (queryKeys.includes(queryInfo.queryKey as any)) {
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
