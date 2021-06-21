import { QueryInfo, SelectOption } from '../types';

export interface FilterList<T> {
  (regex: RegExp | null, list: T[]): T[];
}

export enum QueryFilters {
  queryKey = 'query key',
  reducerPath = 'reducerPath',
  endpointName = 'endpoint',
  status = 'status',
}

function filterByQueryKey(
  regex: RegExp | null,
  list: QueryInfo[]
): QueryInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((queryInfo) => regex.test(queryInfo.queryKey));
}

function filterByReducerPath(
  regex: RegExp | null,
  list: QueryInfo[]
): QueryInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((queryInfo) => regex.test(queryInfo.reducerPath));
}

function filterByEndpointName(
  regex: RegExp | null,
  list: QueryInfo[]
): QueryInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((queryInfo) =>
    regex.test(queryInfo.query.endpointName ?? 'undefined')
  );
}

function filterByStatus(regex: RegExp | null, list: QueryInfo[]): QueryInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((queryInfo) => regex.test(queryInfo.query.status));
}

export const filterQueryOptions: SelectOption<QueryFilters>[] = [
  { label: 'query key', value: QueryFilters.queryKey },
  { label: 'reducerPath', value: QueryFilters.reducerPath },
  { label: 'status', value: QueryFilters.status },
  { label: 'endpoint', value: QueryFilters.endpointName },
];

export const queryListFilters: Readonly<
  Record<QueryFilters, FilterList<QueryInfo>>
> = {
  [QueryFilters.queryKey]: filterByQueryKey,
  [QueryFilters.endpointName]: filterByEndpointName,
  [QueryFilters.reducerPath]: filterByReducerPath,
  [QueryFilters.status]: filterByStatus,
};
