import { QueryStatus } from '@reduxjs/toolkit/query';
import { QueryInfo, SelectOption } from '../types';

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
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  const thisFulfilled = thisQueryInfo.query.fulfilledTimeStamp ?? -1;
  const thatFulfilled = thatQueryInfo.query.fulfilledTimeStamp ?? -1;

  return thisFulfilled - thatFulfilled;
}

const mapStatusToFactor = {
  [QueryStatus.uninitialized]: 1,
  [QueryStatus.pending]: 2,
  [QueryStatus.rejected]: 3,
  [QueryStatus.fulfilled]: 4,
};

function sortQueryByStatus(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  const thisTerm = mapStatusToFactor[thisQueryInfo.query.status] || -1;
  const thatTerm = mapStatusToFactor[thatQueryInfo.query.status] || -1;

  return thisTerm - thatTerm;
}

function compareJSONPrimitive<T extends string | number | boolean | null>(
  a: T,
  b: T
): number {
  if (a === b) {
    return 0;
  }

  return a > b ? 1 : -1;
}

function sortByQueryKey(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  return compareJSONPrimitive(thisQueryInfo.queryKey, thatQueryInfo.queryKey);
}

function sortQueryByEndpointName(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  const thisEndpointName = thisQueryInfo.query.endpointName ?? '';
  const thatEndpointName = thatQueryInfo.query.endpointName ?? '';

  return compareJSONPrimitive(thisEndpointName, thatEndpointName);
}

function sortByApiReducerPath(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  return compareJSONPrimitive(
    thisQueryInfo.reducerPath,
    thatQueryInfo.reducerPath
  );
}

export const queryComparators: Readonly<
  Record<QueryComparators, Comparator<QueryInfo>>
> = {
  [QueryComparators.fulfilledTimeStamp]: sortQueryByFulfilled,
  [QueryComparators.status]: sortQueryByStatus,
  [QueryComparators.endpointName]: sortQueryByEndpointName,
  [QueryComparators.queryKey]: sortByQueryKey,
  [QueryComparators.apiReducerPath]: sortByApiReducerPath,
};
