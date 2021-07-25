import { Action } from 'redux';
import { createSelector } from 'reselect';
import { isPlainObject } from './object';
import { oneOfGroup } from './regexp';
import { createShallowEqualSelector, SelectorsSource } from './selectors';

interface RtkQueryApiState {
  queries: Record<string, unknown>;
  mutations: Record<string, unknown>;
  config: Record<string, unknown>;
  provided: Record<string, unknown>;
  subscriptions: Record<string, unknown>;
}

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
    if (!isPlainObject(val[rtkqueryApiStateKeys[i]])) {
      return false;
    }
  }

  return true;
}

function getApiReducerPaths(currentUserState: unknown): string[] | null {
  if (!isPlainObject(currentUserState)) {
    return null;
  }

  const userStateKeys = Object.keys(currentUserState);
  const output: string[] = [];

  for (const key of userStateKeys) {
    if (isApiSlice(currentUserState[key])) {
      output.push(key);
    }
  }

  return output;
}

const knownRtkQueryActionPrefixes = oneOfGroup([
  'executeQuery',
  'executeMutation',
  'config',
  'subscriptions',
  'invalidation',
  'mutations',
  'queries',
]);

/**
 * Returns a regex that matches rtk query actions from an array of api
 * `reducerPaths`.
 * @param reducerPaths list of rtkQuery reducerPaths in user state.
 * @returns
 */
function generateRtkQueryActionRegex(
  reducerPaths: string[] | null
): RegExp | null {
  if (!reducerPaths?.length) {
    return null;
  }

  return new RegExp(
    `^${oneOfGroup(reducerPaths)}/${knownRtkQueryActionPrefixes}`
  );
}

export interface SelectRTKQueryActionRegex<S, A extends Action<unknown>> {
  (selectorsSource: SelectorsSource<S, A>): RegExp | null;
}

export function makeSelectRtkQueryActionRegex<
  S,
  A extends Action<unknown>
>(): SelectRTKQueryActionRegex<S, A> {
  const selectApiReducerPaths = createSelector(
    (source: SelectorsSource<S, A>) =>
      source.computedStates[source.currentStateIndex]?.state,
    getApiReducerPaths
  );

  const selectRtkQueryActionRegex = createShallowEqualSelector(
    selectApiReducerPaths,
    generateRtkQueryActionRegex
  );

  return selectRtkQueryActionRegex;
}
