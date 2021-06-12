import { LiftedAction, LiftedState } from '@redux-devtools/instrument';
import type { createApi } from '@reduxjs/toolkit/query';
import { Dispatch } from 'react';
import { Base16Theme } from 'react-base16-styling';
import { Action } from 'redux';
import * as themes from 'redux-devtools-themes';
import { QueryComparators } from './utils/comparators';

export interface QueryFormValues {
  queryComparator: QueryComparators;
  isAscendingQueryComparatorOrder: boolean;
  searchValue: string;
}
export interface RtkQueryInspectorMonitorState {
  readonly queryForm: {
    values: QueryFormValues;
  };
  readonly selectedQueryKey: Pick<QueryInfo, 'reducerPath' | 'queryKey'> | null;
}

export interface RtkQueryInspectorMonitorProps<S, A extends Action<unknown>>
  extends LiftedState<S, A, RtkQueryInspectorMonitorState> {
  dispatch: Dispatch<
    Action | LiftedAction<S, A, RtkQueryInspectorMonitorState>
  >;

  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  hideMainButtons?: boolean;
  invertTheme?: boolean;
}

export type RtkQueryApiState = ReturnType<
  ReturnType<typeof createApi>['reducer']
>;

export type RtkQueryState = NonNullable<
  RtkQueryApiState['queries'][keyof RtkQueryApiState]
>;

export interface ExternalProps<S, A extends Action<unknown>> {
  dispatch: Dispatch<
    Action | LiftedAction<S, A, RtkQueryInspectorMonitorState>
  >;

  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  hideMainButtons?: boolean;
  invertTheme: boolean;
}

export type AnyExternalProps = ExternalProps<unknown, any>;

export interface QueryInfo {
  query: RtkQueryState;
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
  monitorState: RtkQueryInspectorMonitorState;
}
