import { Action, createSelector, Selector } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './RtkQueryInspector';
import { QueryInfo, RtkQueryInspectorMonitorState } from './types';
import { Comparator, queryComparators } from './utils/comparators';
import {
  getApiStatesOf,
  extractAllApiQueries,
  flipComparator,
} from './utils/rtk-query';

type SelectorsSource<S> = {
  currentState: S | null;
  monitorState: RtkQueryInspectorMonitorState;
};

type InspectorSelector<S, Output> = Selector<SelectorsSource<S>, Output>;

export function computeSelectorSource<S, A extends Action<unknown>>(
  props: RtkQueryInspectorProps<S, A>,
  previous: SelectorsSource<S> | null = null
): SelectorsSource<S> {
  const { computedStates, currentStateIndex, monitorState } = props;

  const currentState =
    computedStates.length > 0 ? computedStates[currentStateIndex].state : null;

  if (
    !previous ||
    previous.currentState !== currentState ||
    previous.monitorState !== monitorState
  ) {
    return {
      currentState,
      monitorState,
    };
  }

  return previous;
}

export interface InspectorSelectors<S> {
  readonly selectQueryComparator: InspectorSelector<S, Comparator<QueryInfo>>;
  readonly selectApiStates: InspectorSelector<
    S,
    ReturnType<typeof getApiStatesOf>
  >;
  readonly selectAllQueries: InspectorSelector<
    S,
    ReturnType<typeof extractAllApiQueries>
  >;
  readonly selectAllSortedQueries: InspectorSelector<S, QueryInfo[]>;
  readonly selectorCurrentQueryInfo: InspectorSelector<S, QueryInfo | null>;
}

export function createInspectorSelectors<S>(): InspectorSelectors<S> {
  const selectQueryComparator = ({
    monitorState,
  }: SelectorsSource<S>): Comparator<QueryInfo> => {
    return queryComparators[monitorState.queryComparator];
  };

  const selectApiStates = createSelector(
    ({ currentState }: SelectorsSource<S>) => currentState,
    getApiStatesOf
  );
  const selectAllQueries = createSelector(
    selectApiStates,
    extractAllApiQueries
  );

  const selectAllSortedQueries = createSelector(
    [
      selectQueryComparator,
      selectAllQueries,
      ({ monitorState }: SelectorsSource<S>) =>
        monitorState.isAscendingQueryComparatorOrder,
    ],
    (comparator, queryList, isAscending) => {
      console.log({ comparator, queryList, isAscending });

      const computedComparator = isAscending
        ? comparator
        : flipComparator(comparator);

      return queryList.slice().sort(computedComparator);
    }
  );

  const selectorCurrentQueryInfo = createSelector(
    selectAllQueries,
    ({ monitorState }: SelectorsSource<S>) => monitorState.selectedQueryKey,
    (allQueries, selectedQueryKey) => {
      if (!selectedQueryKey) {
        return null;
      }

      const currentQueryInfo =
        allQueries.find(
          (query) =>
            query.queryKey === selectedQueryKey.queryKey &&
            selectedQueryKey.reducerPath === query.reducerPath
        ) || null;

      return currentQueryInfo;
    }
  );

  return {
    selectQueryComparator,
    selectApiStates,
    selectAllQueries,
    selectAllSortedQueries,
    selectorCurrentQueryInfo,
  };
}
