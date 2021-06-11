import { Action, AnyAction } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RtkQueryInspectorProps } from './RtkQueryInspector';
import { QueryInfo, RtkQueryInspectorMonitorState } from './types';
import { QueryComparators } from './utils/comparators';

const initialState: RtkQueryInspectorMonitorState = {
  queryComparator: QueryComparators.fulfilledTimeStamp,
  isAscendingQueryComparatorOrder: false,
  selectedQueryKey: null,
};

const monitorSlice = createSlice({
  name: 'rtk-query-monitor',
  initialState,
  reducers: {
    changeQueryComparator(state, action: PayloadAction<QueryComparators>) {
      state.queryComparator = action.payload;
    },
    changeIsAscendingQueryComparatorOrder(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isAscendingQueryComparatorOrder = !!action.payload;
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

export const {
  changeIsAscendingQueryComparatorOrder,
  changeQueryComparator,
  selectQueryKey,
} = monitorSlice.actions;
