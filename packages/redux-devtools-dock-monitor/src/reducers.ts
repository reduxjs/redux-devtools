import { Children } from 'react';
import { Action } from 'redux';
import {
  CHANGE_MONITOR,
  CHANGE_POSITION,
  CHANGE_SIZE,
  DockMonitorAction,
  TOGGLE_VISIBILITY,
} from './actions';
import { POSITIONS } from './constants';
import { DockMonitorProps } from './DockMonitor';

export interface DockMonitorState {
  position: 'left' | 'top' | 'right' | 'bottom';
  size: number;
  isVisible: boolean;
  childMonitorStates: unknown[];
  childMonitorIndex: number;
}

function position<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state = props.defaultPosition,
  action: DockMonitorAction,
) {
  return action.type === CHANGE_POSITION
    ? POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length]
    : state;
}

function size<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state = props.defaultSize,
  action: DockMonitorAction,
) {
  return action.type === CHANGE_SIZE ? action.size : state;
}

function isVisible<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state = props.defaultIsVisible,
  action: DockMonitorAction,
) {
  return action.type === TOGGLE_VISIBILITY ? !state : state;
}

function childMonitorStates<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state: unknown[] = [],
  action: DockMonitorAction,
) {
  return Children.map(props.children, (child, index) =>
    child.type.update(child.props, state[index], action),
  );
}

function childMonitorIndex<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state = 0,
  action: DockMonitorAction,
) {
  switch (action.type) {
    case CHANGE_MONITOR:
      return (state + 1) % Children.count(props.children);
    default:
      return state;
  }
}

export default function reducer<S, A extends Action<string>>(
  props: DockMonitorProps<S, A>,
  state: Partial<DockMonitorState> = {},
  action: DockMonitorAction,
): DockMonitorState {
  if (!state.childMonitorStates) {
    Children.forEach(props.children, (child, index) => {
      if (typeof child.type.update !== 'function') {
        // eslint-disable-next-line no-console
        console.error(
          `Child of <DockMonitor> with the index ${index} ` +
            `(${
              child.type.displayName ||
              child.type.name ||
              (child.type as unknown as string)
            }) ` +
            'does not appear to be a valid Redux DevTools monitor.',
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
      action,
    ),
    childMonitorStates: childMonitorStates(
      props,
      state.childMonitorStates,
      action,
    ),
  };
}
