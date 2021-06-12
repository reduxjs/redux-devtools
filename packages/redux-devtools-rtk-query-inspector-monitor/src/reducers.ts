import { Action, AnyAction } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './RtkQueryInspector';
import {
  QueryInfo,
  RtkQueryInspectorMonitorState,
  QueryFormValues,
} from './types';
import { QueryComparators } from './utils/comparators';

const initialState: RtkQueryInspectorMonitorState = {
  queryForm: {
    values: {
      queryComparator: QueryComparators.fulfilledTimeStamp,
      isAscendingQueryComparatorOrder: false,
      searchValue: '',
    },
  },
  selectedQueryKey: null,
};

const monitorSlice = createSlice({
  name: 'rtk-query-monitor',
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
  },
});

export default function reducer<S, A extends Action<unknown>>(
  props: RtkQueryInspectorProps<S, A>,
  state: RtkQueryInspectorMonitorState | undefined = initialState,
  action: AnyAction
): RtkQueryInspectorMonitorState {
  const output = monitorSlice.reducer(state, action);

  return output;
}

export const { selectQueryKey, changeQueryFormValues } = monitorSlice.actions;
