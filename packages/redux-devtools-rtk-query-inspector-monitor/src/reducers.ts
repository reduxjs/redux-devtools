import { Action, AnyAction } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './RtkQueryInspector';
import {
  QueryInfo,
  RtkQueryInspectorMonitorState,
  QueryFormValues,
  QueryPreviewTabs,
} from './types';
import { QueryComparators } from './utils/comparators';
import { QueryFilters } from './utils/filters';

const initialState: RtkQueryInspectorMonitorState = {
  queryForm: {
    values: {
      queryComparator: QueryComparators.fulfilledTimeStamp,
      isAscendingQueryComparatorOrder: false,
      searchValue: '',
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
  name: '@@rtk-query-inspector-monitor',
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
  props: RtkQueryInspectorProps<S, A>,
  state: RtkQueryInspectorMonitorState | undefined,
  action: AnyAction
): RtkQueryInspectorMonitorState {
  return monitorSlice.reducer(state, action);
}

export const {
  selectQueryKey,
  changeQueryFormValues,
  selectedPreviewTab,
} = monitorSlice.actions;
