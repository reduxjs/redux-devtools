import { RtkResourceInfo, SelectOption } from '../types';

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
  list: RtkResourceInfo[]
): RtkResourceInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((RtkResourceInfo) => regex.test(RtkResourceInfo.queryKey));
}

function filterByReducerPath(
  regex: RegExp | null,
  list: RtkResourceInfo[]
): RtkResourceInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((RtkResourceInfo) =>
    regex.test(RtkResourceInfo.reducerPath)
  );
}

function filterByEndpointName(
  regex: RegExp | null,
  list: RtkResourceInfo[]
): RtkResourceInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((RtkResourceInfo) =>
    regex.test(RtkResourceInfo.state.endpointName ?? 'undefined')
  );
}

function filterByStatus(
  regex: RegExp | null,
  list: RtkResourceInfo[]
): RtkResourceInfo[] {
  if (!regex) {
    return list;
  }

  return list.filter((RtkResourceInfo) =>
    regex.test(RtkResourceInfo.state.status)
  );
}

export const filterQueryOptions: SelectOption<QueryFilters>[] = [
  { label: 'query key', value: QueryFilters.queryKey },
  { label: 'reducerPath', value: QueryFilters.reducerPath },
  { label: 'status', value: QueryFilters.status },
  { label: 'endpoint', value: QueryFilters.endpointName },
];

export const queryListFilters: Readonly<
  Record<QueryFilters, FilterList<RtkResourceInfo>>
> = {
  [QueryFilters.queryKey]: filterByQueryKey,
  [QueryFilters.endpointName]: filterByEndpointName,
  [QueryFilters.reducerPath]: filterByReducerPath,
  [QueryFilters.status]: filterByStatus,
};
