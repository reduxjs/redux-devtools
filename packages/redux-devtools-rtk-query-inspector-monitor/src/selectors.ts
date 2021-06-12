import { Action, createSelector, Selector } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './RtkQueryInspector';
import { QueryInfo, SelectorsSource } from './types';
import { Comparator, queryComparators } from './utils/comparators';
import { escapeRegExpSpecialCharacter } from './utils/regexp';
import {
  getApiStatesOf,
  extractAllApiQueries,
  flipComparator,
} from './utils/rtk-query';

type InspectorSelector<S, Output> = Selector<SelectorsSource<S>, Output>;

export function computeSelectorSource<S, A extends Action<unknown>>(
  props: RtkQueryInspectorProps<S, A>,
  previous: SelectorsSource<S> | null = null
): SelectorsSource<S> {
  const { computedStates, currentStateIndex, monitorState } = props;

  const userState =
    computedStates.length > 0 ? computedStates[currentStateIndex].state : null;

  if (
    !previous ||
    previous.userState !== userState ||
    previous.monitorState !== monitorState
  ) {
    return {
      userState,
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
  readonly selectAllVisbileQueries: InspectorSelector<S, QueryInfo[]>;
  readonly selectorCurrentQueryInfo: InspectorSelector<S, QueryInfo | null>;
  readonly selectSearchQueryRegex: InspectorSelector<S, RegExp | null>;
}

export function createInspectorSelectors<S>(): InspectorSelectors<S> {
  const selectQueryComparator = ({
    monitorState,
  }: SelectorsSource<S>): Comparator<QueryInfo> => {
    return queryComparators[monitorState.queryForm.values.queryComparator];
  };

  const selectApiStates = createSelector(
    ({ userState }: SelectorsSource<S>) => userState,
    getApiStatesOf
  );
  const selectAllQueries = createSelector(
    selectApiStates,
    extractAllApiQueries
  );

  const selectSearchQueryRegex = createSelector(
    ({ monitorState }: SelectorsSource<S>) =>
      monitorState.queryForm.values.searchValue,
    (searchValue) => {
      if (searchValue.length >= 3) {
        return new RegExp(escapeRegExpSpecialCharacter(searchValue), 'i');
      }
      return null;
    }
  );

  const selectAllVisbileQueries = createSelector(
    [
      selectQueryComparator,
      selectAllQueries,
      ({ monitorState }: SelectorsSource<S>) =>
        monitorState.queryForm.values.isAscendingQueryComparatorOrder,
      selectSearchQueryRegex,
    ],
    (comparator, queryList, isAscending, searchRegex) => {
      const filteredList = searchRegex
        ? queryList.filter((queryInfo) => searchRegex.test(queryInfo.queryKey))
        : queryList.slice();

      const computedComparator = isAscending
        ? comparator
        : flipComparator(comparator);

      return filteredList.sort(computedComparator);
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
    selectAllVisbileQueries,
    selectSearchQueryRegex,
    selectorCurrentQueryInfo,
  };
}
