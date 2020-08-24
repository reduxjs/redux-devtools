import {
  CHANGE_MONITOR,
  CHANGE_POSITION,
  CHANGE_SIZE,
  TOGGLE_VISIBILITY,
} from './actions';
import { POSITIONS } from './constants';
import { Children } from 'react';

function position(props, state = props.defaultPosition, action) {
  return action.type === CHANGE_POSITION
    ? POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length]
    : state;
}

function size(props, state = props.defaultSize, action) {
  return action.type === CHANGE_SIZE ? action.size : state;
}

function isVisible(props, state = props.defaultIsVisible, action) {
  return action.type === TOGGLE_VISIBILITY ? !state : state;
}

function childMonitorStates(props, state = [], action) {
  return Children.map(props.children, (child, index) =>
    child.type.update(child.props, state[index], action)
  );
}

function childMonitorIndex(props, state = 0, action) {
  switch (action.type) {
    case CHANGE_MONITOR:
      return (state + 1) % Children.count(props.children);
    default:
      return state;
  }
}

export default function reducer(props, state = {}, action) {
  if (!state.childMonitorStates) {
    Children.forEach(props.children, (child, index) => {
      if (typeof child.type.update !== 'function') {
        // eslint-disable-next-line no-console
        console.error(
          `Child of <DockMonitor> with the index ${index} ` +
            `(${child.type.displayName || child.type.name || child.type}) ` +
            'does not appear to be a valid Redux DevTools monitor.'
        );
      }
    });
  }

  return {
    position: position(props, state.position, action),
    isVisible: isVisible(props, state.isVisible, action),
    size: size(props, state.size, action),
    childMonitorIndex: childMonitorIndex(
      props,
      state.childMonitorIndex,
      action
    ),
    childMonitorStates: childMonitorStates(
      props,
      state.childMonitorStates,
      action
    ),
  };
}
