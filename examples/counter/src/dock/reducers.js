import { CHANGE_POSITION, CHANGE_SIZE, TOGGLE_VISIBILITY } from './actions';
import { POSITIONS } from './constants';

function position(state = props.defaultPosition, action, props) {
  return (action.type === CHANGE_POSITION) ?
    POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
    state;
}

function size(state = props.defaultSize, action, props) {
  return (action.type === CHANGE_SIZE) ?
    action.size :
    state;
}

function isVisible(state = props.defaultIsVisible, action, props) {
  return (action.type === TOGGLE_VISIBILITY) ?
    !state :
    state;
}

function childMonitorState(state, action, props) {
  const child = props.children;
  return child.type.reducer(state, action, child.props);
}

export default function reducer(state = {}, action, props) {
  return {
    position: position(state.position, action, props),
    isVisible: isVisible(state.isVisible, action, props),
    size: size(state.size, action, props),
    childMonitorState: childMonitorState(state.childMonitorState, action, props)
  };
}
