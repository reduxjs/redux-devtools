import {
  instancesInitialState,
  dispatchAction,
  UPDATE_STATE,
  SELECT_INSTANCE,
  LIFTED_ACTION,
  SET_PERSIST,
} from '@redux-devtools/app';
import type {
  ExpandedUpdateStateAction,
  WindowStoreAction,
} from './windowStore';

export default function instances(
  state = instancesInitialState,
  action: WindowStoreAction,
) {
  switch (action.type) {
    case UPDATE_STATE:
      return {
        ...(action as ExpandedUpdateStateAction).instances,
        selected: state.selected,
      };
    case LIFTED_ACTION:
      if (action.message === 'DISPATCH') return dispatchAction(state, action);
      return state;
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected };
    case SET_PERSIST:
      return { ...state, persisted: action.payload };
    default:
      return state;
  }
}
