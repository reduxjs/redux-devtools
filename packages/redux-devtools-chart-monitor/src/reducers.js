import { TOGGLE_VISIBILITY } from './actions';

function toggleVisibility(props, state = props.defaultIsVisible, action) {
  if (action.type === TOGGLE_VISIBILITY) {
    return !state;
  }

  if (props.defaultIsVisible !== undefined) {
    return props.defaultIsVisible;
  }

  return true;
}

export default function reducer(props, state = {}, action) {
  return {
    isVisible: toggleVisibility(props, state.isVisible, action),
  };
}
