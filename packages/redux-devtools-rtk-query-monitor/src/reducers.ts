import { Action, AnyAction } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  QueryInfo,
  RtkQueryMonitorState,
  QueryFormValues,
  RtkQueryMonitorProps,
  QueryPreviewTabs,
} from './types';
import { QueryComparators } from './utils/comparators';
import { QueryFilters } from './utils/filters';

const initialState: RtkQueryMonitorState = {
  queryForm: {
    values: {
      queryComparator: QueryComparators.fulfilledTimeStamp,
      isAscendingQueryComparatorOrder: false,
      searchValue: '',
      isRegexSearch: false,
      queryFilter: QueryFilters.queryKey,
    },
  },
  selectedPreviewTab: QueryPreviewTabs.queryinfo,
  selectedQueryKey: null,
};

const monitorSlice = createSlice({
  /**
   * `@@` prefix is mandatory.
   * @see lifedAction @ `packages/redux-devtools-app/src/actions/index.ts`
   */
  name: '@@rtk-query-monitor',
  initialState,
  reducers: {
    changeQueryFormValues(
      state,
      action: PayloadAction<Partial<QueryFormValues>>
    ) {
      state.queryForm.values = { ...state.queryForm.values, ...action.payload };
    },
    selectQueryKey(
      state,
      action: PayloadAction<Pick<QueryInfo, 'reducerPath' | 'queryKey'>>
    ) {
      state.selectedQueryKey = {
        queryKey: action.payload.queryKey,
        reducerPath: action.payload.reducerPath,
      };
    },
    selectedPreviewTab(state, action: PayloadAction<QueryPreviewTabs>) {
      state.selectedPreviewTab = action.payload;
    },
  },
});

export function reducer<S, A extends Action<unknown>>(
  props: RtkQueryMonitorProps<S, A>,
  state: RtkQueryMonitorState | undefined,
  action: AnyAction
): RtkQueryMonitorState {
  return monitorSlice.reducer(state, action);
}

export const { selectQueryKey, changeQueryFormValues, selectedPreviewTab } =
  monitorSlice.actions;
