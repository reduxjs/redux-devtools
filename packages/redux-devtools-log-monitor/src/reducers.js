import { UPDATE_SCROLL_TOP, START_CONSECUTIVE_TOGGLE } from './actions';

function initialScrollTop(props, state = 0, action) {
  if (!props.preserveScrollTop) {
    return 0;
  }

  return action.type === UPDATE_SCROLL_TOP ?
    action.scrollTop :
    state;
}

function startConsecutiveToggle(props, state, action) {
  return action.type === START_CONSECUTIVE_TOGGLE ?
    action.id :
    state;
}

export default function reducer(props, state = {}, action) {
  return {
    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action),
    consecutiveToggleStartId: startConsecutiveToggle(props, state.consecutiveToggleStartId, action)
  };
}
