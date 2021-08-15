import { Action, createSelector, Selector } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './containers/RtkQueryInspector';
import {
  ApiStats,
  QueryInfo,
  RtkQueryApiState,
  RtkQueryTag,
  SelectorsSource,
  RtkQueryProvided,
  QueryPreviewTabs,
  RtkResourceInfo,
} from './types';
import { Comparator, queryComparators } from './utils/comparators';
import { FilterList, queryListFilters } from './utils/filters';
import { emptyRecord } from './utils/object';
import { escapeRegExpSpecialCharacter } from './utils/regexp';
import {
  getApiStatesOf,
  extractAllApiQueries,
  flipComparator,
  getQueryTagsOf,
  generateApiStatsOfCurrentQuery,
  getActionsOfCurrentQuery,
  extractAllApiMutations,
} from './utils/rtk-query';

type InspectorSelector<S, Output> = Selector<SelectorsSource<S>, Output>;

export function computeSelectorSource<S, A extends Action<unknown>>(
  props: RtkQueryInspectorProps<S, A>,
  previous: SelectorsSource<S> | null = null
): SelectorsSource<S> {
  const { computedStates, currentStateIndex, monitorState, actionsById } =
    props;

  const userState =
    computedStates.length > 0 ? computedStates[currentStateIndex].state : null;

  if (
    !previous ||
    previous.userState !== userState ||
    previous.monitorState !== monitorState ||
    previous.actionsById !== actionsById
  ) {
    return {
      userState,
      monitorState,
      currentStateIndex,
      actionsById,
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
  readonly selectAllVisbileQueries: InspectorSelector<S, RtkResourceInfo[]>;
  readonly selectCurrentQueryInfo: InspectorSelector<S, RtkResourceInfo | null>;
  readonly selectSearchQueryRegex: InspectorSelector<S, RegExp | null>;
  readonly selectCurrentQueryTags: InspectorSelector<S, RtkQueryTag[]>;
  readonly selectApiStatsOfCurrentQuery: InspectorSelector<S, ApiStats | null>;
  readonly selectApiOfCurrentQuery: InspectorSelector<
    S,
    RtkQueryApiState | null
  >;
  readonly selectTabCounters: InspectorSelector<
    S,
    Record<QueryPreviewTabs, number>
  >;
  readonly selectSubscriptionsOfCurrentQuery: InspectorSelector<
    S,
    RtkQueryApiState['subscriptions'][string]
  >;
  readonly selectActionsOfCurrentQuery: InspectorSelector<
    S,
    ReturnType<typeof getActionsOfCurrentQuery>
  >;
}

export function createInspectorSelectors<S>(): InspectorSelectors<S> {
  const selectQueryComparator = ({
    monitorState,
  }: SelectorsSource<S>): Comparator<RtkResourceInfo> => {
    return queryComparators[monitorState.queryForm.values.queryComparator];
  };

  const selectQueryListFilter = ({
    monitorState,
  }: SelectorsSource<S>): FilterList<RtkResourceInfo> => {
    return queryListFilters[monitorState.queryForm.values.queryFilter];
  };

  const selectActionsById = ({ actionsById }: SelectorsSource<S>) =>
    actionsById;

  const selectApiStates = createSelector(
    ({ userState }: SelectorsSource<S>) => userState,
    getApiStatesOf
  );
  const selectAllQueries = createSelector(
    selectApiStates,
    extractAllApiQueries
  );

  const selectAllMutations = createSelector(
    selectApiStates,
    extractAllApiMutations
  );

  const selectSearchQueryRegex = createSelector(
    ({ monitorState }: SelectorsSource<S>) =>
      monitorState.queryForm.values.searchValue,
    ({ monitorState }: SelectorsSource<S>) =>
      monitorState.queryForm.values.isRegexSearch,
    (searchValue, isRegexSearch) => {
      if (searchValue) {
        try {
          const regexPattern = isRegexSearch
            ? searchValue
            : escapeRegExpSpecialCharacter(searchValue);

          return new RegExp(regexPattern, 'i');
        } catch (err) {
          // We notify that the search regex provided is not valid
        }
      }

      return null;
    }
  );

  const selectComparatorOrder = ({ monitorState }: SelectorsSource<S>) =>
    monitorState.queryForm.values.isAscendingQueryComparatorOrder;

  const selectAllVisbileQueries = createSelector(
    [
      selectQueryComparator,
      selectQueryListFilter,
      selectAllQueries,
      selectAllMutations,
      selectComparatorOrder,
      selectSearchQueryRegex,
    ],
    (
      comparator,
      queryListFilter,
      queryList,
      mutationsList,
      isAscending,
      searchRegex
    ) => {
      const filteredList = queryListFilter(
        searchRegex,
        (queryList as RtkResourceInfo[]).concat(mutationsList)
      );

      const computedComparator = isAscending
        ? comparator
        : flipComparator(comparator);

      return filteredList.slice().sort(computedComparator);
    }
  );

  const selectCurrentQueryInfo = createSelector(
    selectAllQueries,
    selectAllMutations,
    ({ monitorState }: SelectorsSource<S>) => monitorState.selectedQueryKey,
    (allQueries, allMutations, selectedQueryKey) => {
      if (!selectedQueryKey) {
        return null;
      }

      let currentQueryInfo: null | RtkResourceInfo =
        allQueries.find(
          (query) =>
            query.queryKey === selectedQueryKey.queryKey &&
            selectedQueryKey.reducerPath === query.reducerPath
        ) || null;

      if (!currentQueryInfo) {
        currentQueryInfo =
          allMutations.find(
            (mutation) =>
              mutation.queryKey === selectedQueryKey.queryKey &&
              selectedQueryKey.reducerPath === mutation.reducerPath
          ) || null;
      }

      return currentQueryInfo;
    }
  );

  const selectApiOfCurrentQuery: InspectorSelector<S, null | RtkQueryApiState> =
    (selectorsSource: SelectorsSource<S>) => {
      const apiStates = selectApiStates(selectorsSource);
      const currentQueryInfo = selectCurrentQueryInfo(selectorsSource);

      if (!apiStates || !currentQueryInfo) {
        return null;
      }

      return apiStates[currentQueryInfo.reducerPath] ?? null;
    };

  const selectProvidedOfCurrentQuery: InspectorSelector<
    S,
    null | RtkQueryProvided
  > = (selectorsSource: SelectorsSource<S>) => {
    return selectApiOfCurrentQuery(selectorsSource)?.provided ?? null;
  };

  const selectSubscriptionsOfCurrentQuery = createSelector(
    [selectApiOfCurrentQuery, selectCurrentQueryInfo],
    (apiState, queryInfo) => {
      if (!queryInfo || !apiState) {
        return emptyRecord;
      }

      return apiState.subscriptions[queryInfo.queryKey];
    }
  );

  const selectCurrentQueryTags = createSelector(
    [selectCurrentQueryInfo, selectProvidedOfCurrentQuery],
    getQueryTagsOf
  );

  const selectApiStatsOfCurrentQuery = createSelector(
    selectApiOfCurrentQuery,
    (selectorsSource) => selectorsSource.actionsById,
    (selectorsSource) => selectorsSource.currentStateIndex,
    generateApiStatsOfCurrentQuery
  );

  const selectActionsOfCurrentQuery = createSelector(
    selectCurrentQueryInfo,
    selectActionsById,
    getActionsOfCurrentQuery
  );

  const selectTabCounters = createSelector(
    [
      selectSubscriptionsOfCurrentQuery,
      selectActionsOfCurrentQuery,
      selectCurrentQueryTags,
    ],
    (subscriptions, actions, tags) => {
      return {
        [QueryPreviewTabs.queryTags]: tags.length,
        [QueryPreviewTabs.querySubscriptions]: Object.keys(subscriptions ?? {})
          .length,
        [QueryPreviewTabs.apiConfig]: 0,
        [QueryPreviewTabs.queryinfo]: 0,
        [QueryPreviewTabs.actions]: actions.length,
      };
    }
  );

  return {
    selectQueryComparator,
    selectApiStates,
    selectAllQueries,
    selectAllVisbileQueries,
    selectSearchQueryRegex,
    selectCurrentQueryInfo,
    selectCurrentQueryTags,
    selectApiStatsOfCurrentQuery,
    selectSubscriptionsOfCurrentQuery,
    selectApiOfCurrentQuery,
    selectTabCounters,
    selectActionsOfCurrentQuery,
  };
}
