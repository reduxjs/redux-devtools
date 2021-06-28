import type { LiftedAction, LiftedState } from '@redux-devtools/instrument';
import type { createApi, QueryStatus } from '@reduxjs/toolkit/query';
import type { Action, AnyAction, Dispatch } from '@reduxjs/toolkit';
import type { ComponentType } from 'react';
import type { Base16Theme, StylingFunction } from 'react-base16-styling';
import type * as themes from 'redux-devtools-themes';
import type { QueryComparators } from './utils/comparators';
import type { QueryFilters } from './utils/filters';

export enum QueryPreviewTabs {
  queryinfo,
  apiConfig,
  querySubscriptions,
  queryTags,
  actions,
}

export interface QueryFormValues {
  queryComparator: QueryComparators;
  isAscendingQueryComparatorOrder: boolean;
  searchValue: string;
  queryFilter: QueryFilters;
}
export interface RtkQueryMonitorState {
  readonly queryForm: {
    values: QueryFormValues;
  };
  readonly selectedQueryKey: Pick<QueryInfo, 'reducerPath' | 'queryKey'> | null;
  readonly selectedPreviewTab: QueryPreviewTabs;
}

export interface RtkQueryMonitorProps<S, A extends Action<unknown>>
  extends LiftedState<S, A, RtkQueryMonitorState> {
  dispatch: Dispatch<Action | LiftedAction<S, A, RtkQueryMonitorState>>;
  theme: keyof typeof themes | Base16Theme;
  invertTheme?: boolean;
}

export type RtkQueryApiState = ReturnType<
  ReturnType<typeof createApi>['reducer']
>;

export type RtkQueryState = NonNullable<
  RtkQueryApiState['queries'][keyof RtkQueryApiState]
>;

export type RtkMutationState = NonNullable<
  RtkQueryApiState['mutations'][keyof RtkQueryApiState]
>;

export type RtkQueryApiConfig = RtkQueryApiState['config'];

export type RtkQueryProvided = RtkQueryApiState['provided'];

export interface ExternalProps<S, A extends Action<unknown>> {
  dispatch: Dispatch<Action | LiftedAction<S, A, RtkQueryMonitorState>>;
  theme: keyof typeof themes | Base16Theme;
  hideMainButtons?: boolean;
  invertTheme: boolean;
}

export interface QueryInfo {
  query: RtkQueryState;
  queryKey: string;
  reducerPath: string;
}

export interface MutationInfo {
  mutation: RtkMutationState;
  queryKey: string;
  reducerPath: string;
}

export interface ApiInfo {
  reducerPath: string;
  apiState: RtkQueryApiState;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface SelectorsSource<S> {
  userState: S | null;
  monitorState: RtkQueryMonitorState;
  actionsById: LiftedState<unknown, AnyAction, unknown>['actionsById'];
}

export interface StyleUtils {
  readonly base16Theme: Base16Theme;
  readonly styling: StylingFunction;
  readonly invertTheme: boolean;
}

export type RTKQuerySubscribers = NonNullable<
  RtkQueryApiState['subscriptions'][keyof RtkQueryApiState['subscriptions']]
>;

export interface RtkQueryTag {
  type: string;
  id?: number | string;
}

interface Tally {
  count: number;
}

export type QueryTally = {
  [key in QueryStatus]?: number;
} &
  Tally;

export interface QueryTimings {
  readonly oldestFetch: { key: string; at: string } | null;
  readonly latestFetch: { key: string; at: string } | null;
  readonly slowest: { key: string; duration: string } | null;
  readonly fastest: { key: string; duration: string } | null;
  readonly average: string;
  readonly median: string;
}

export interface ApiTimings {
  readonly queries: QueryTimings;
  readonly mutations: QueryTimings;
}

export interface ApiStats {
  readonly timings: ApiTimings;
  readonly tally: Readonly<{
    subscriptions: Tally;
    queries: QueryTally;
    tagTypes: Tally;
    mutations: QueryTally;
  }>;
}

export interface TabOption<S, P> extends SelectOption<S> {
  component: ComponentType<P>;
}

/**
 * It is Omit<RequestStatusFlags, 'status'> & { isFetching: boolean; }
 */
export interface RTKStatusFlags {
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}
