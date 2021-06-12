import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { QueryInfo, SelectOption } from '../types';

export interface Comparator<T> {
  (a: T, b: T): number;
}

export enum QueryComparators {
  fulfilledTimeStamp = 'timestamp',
  queryKey = 'key',
  status = 'status',
  endpointName = 'endpointName',
}

export const sortQueryOptions: SelectOption<QueryComparators>[] = [
  { label: 'fulfilledTimeStamp', value: QueryComparators.fulfilledTimeStamp },
  { label: 'query key', value: QueryComparators.queryKey },
  { label: 'status ', value: QueryComparators.status },
  { label: 'endpoint', value: QueryComparators.endpointName },
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

function compareStrings(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  return a > b ? 1 : -1;
}

function sortByQueryKey(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  return compareStrings(thisQueryInfo.queryKey, thatQueryInfo.queryKey);
}

function sortQueryByEndpointName(
  thisQueryInfo: QueryInfo,
  thatQueryInfo: QueryInfo
): number {
  const thisEndpointName = thisQueryInfo.query.endpointName ?? '';
  const thatEndpointName = thatQueryInfo.query.endpointName ?? '';

  return compareStrings(thisEndpointName, thatEndpointName);
}

export const queryComparators: Readonly<Record<
  QueryComparators,
  Comparator<QueryInfo>
>> = {
  [QueryComparators.fulfilledTimeStamp]: sortQueryByFulfilled,
  [QueryComparators.status]: sortQueryByStatus,
  [QueryComparators.endpointName]: sortQueryByEndpointName,
  [QueryComparators.queryKey]: sortByQueryKey,
};
