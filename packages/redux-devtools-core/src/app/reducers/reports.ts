import {
  UPDATE_REPORTS /* , GET_REPORT_SUCCESS */,
} from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface Data {
  id: unknown;
}

export interface ReportsState {
  data: Data[];
}

const initialState: ReportsState = {
  data: [],
};

export default function reports(
  state = initialState,
  action: StoreAction
): ReportsState {
  /* if (action.type === GET_REPORT_SUCCESS) {
    const id = action.data.id;
    return {
      ...state,
      data: state.data.map(d => (d.id === id ? action.data : d))
    };
  } else */ if (
    action.type !== UPDATE_REPORTS
  )
    return state;

  const request = action.request;
  switch (request.type) {
    case 'list':
      return {
        ...state,
        data: request.data,
      };
    case 'add':
      return {
        ...state,
        data: [...state.data, request.data],
      };
    case 'remove':
      return {
        ...state,
        data: state.data.filter((d) => d.id !== request.id),
      };
    default:
      return state;
  }
}
