import {
  initialState,
  dispatchAction,
} from '@redux-devtools/app/lib/reducers/instances';
import {
  UPDATE_STATE,
  SELECT_INSTANCE,
  LIFTED_ACTION,
} from '@redux-devtools/app/lib/constants/actionTypes';
import {
  ExpandedUpdateStateAction,
  WindowStoreAction,
} from '../../stores/windowStore';

export default function instances(
  state = initialState,
  action: WindowStoreAction
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
    default:
      return state;
  }
}
