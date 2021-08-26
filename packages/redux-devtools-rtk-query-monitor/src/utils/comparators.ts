import { QueryStatus } from '@reduxjs/toolkit/query';
import { RtkResourceInfo, SelectOption } from '../types';

export interface Comparator<T> {
  (a: T, b: T): number;
}

export enum QueryComparators {
  fulfilledTimeStamp = 'timestamp',
  queryKey = 'key',
  status = 'status',
  endpointName = 'endpointName',
  apiReducerPath = 'apiReducerPath',
}

export const sortQueryOptions: SelectOption<QueryComparators>[] = [
  { label: 'last updated', value: QueryComparators.fulfilledTimeStamp },
  { label: 'query key', value: QueryComparators.queryKey },
  { label: 'status', value: QueryComparators.status },
  { label: 'endpoint', value: QueryComparators.endpointName },
  { label: 'reducerPath', value: QueryComparators.apiReducerPath },
];

function sortQueryByFulfilled(
  thisQueryInfo: RtkResourceInfo,
  thatQueryInfo: RtkResourceInfo
): number {
  const thisFulfilled = thisQueryInfo.state.fulfilledTimeStamp ?? -1;
  const thatFulfilled = thatQueryInfo.state.fulfilledTimeStamp ?? -1;

  return thisFulfilled - thatFulfilled;
}

const mapStatusToFactor = {
  [QueryStatus.uninitialized]: 1,
  [QueryStatus.pending]: 2,
  [QueryStatus.rejected]: 3,
  [QueryStatus.fulfilled]: 4,
};

function sortQueryByStatus(
  thisQueryInfo: RtkResourceInfo,
  thatQueryInfo: RtkResourceInfo
): number {
  const thisTerm = mapStatusToFactor[thisQueryInfo.state.status] || -1;
  const thatTerm = mapStatusToFactor[thatQueryInfo.state.status] || -1;

  return thisTerm - thatTerm;
}

export function compareJSONPrimitive<
  T extends string | number | boolean | null
>(a: T, b: T): number {
  if (a === b) {
    return 0;
  }

  return a > b ? 1 : -1;
}

function sortByQueryKey(
  thisQueryInfo: RtkResourceInfo,
  thatQueryInfo: RtkResourceInfo
): number {
  return compareJSONPrimitive(thisQueryInfo.queryKey, thatQueryInfo.queryKey);
}

function sortQueryByEndpointName(
  thisQueryInfo: RtkResourceInfo,
  thatQueryInfo: RtkResourceInfo
): number {
  const thisEndpointName = thisQueryInfo.state.endpointName ?? '';
  const thatEndpointName = thatQueryInfo.state.endpointName ?? '';

  return compareJSONPrimitive(thisEndpointName, thatEndpointName);
}

function sortByApiReducerPath(
  thisQueryInfo: RtkResourceInfo,
  thatQueryInfo: RtkResourceInfo
): number {
  return compareJSONPrimitive(
    thisQueryInfo.reducerPath,
    thatQueryInfo.reducerPath
  );
}

export const queryComparators: Readonly<
  Record<QueryComparators, Comparator<RtkResourceInfo>>
> = {
  [QueryComparators.fulfilledTimeStamp]: sortQueryByFulfilled,
  [QueryComparators.status]: sortQueryByStatus,
  [QueryComparators.endpointName]: sortQueryByEndpointName,
  [QueryComparators.queryKey]: sortByQueryKey,
  [QueryComparators.apiReducerPath]: sortByApiReducerPath,
};
