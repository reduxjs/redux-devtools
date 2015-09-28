//
// TODO: extract to a separate project.
//

import React, { Component, PropTypes } from 'react';
import Dock from 'react-dock';
import { combineReducers } from 'redux';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

class DockMonitor extends Component {
  static propTypes = {
    monitorState: PropTypes.shape({
      position: PropTypes.oneOf(POSITIONS).isRequired,
      isVisible: PropTypes.bool.isRequired,
      child: PropTypes.any
    }).isRequired,

    monitorActions: PropTypes.shape({
      toggleVisibility: PropTypes.func.isRequired,
      changePosition: PropTypes.func.isRequired
    }).isRequired
  };

  componentDidMount() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (!e.ctrlKey) {
      return;
    }
    e.preventDefault();

    const key = event.keyCode || event.which;
    const char = String.fromCharCode(key);
    switch (char) {
    case 'H':
      this.props.monitorActions.toggleVisibility();
      break;
    case 'D':
      this.props.monitorActions.changePosition();
      break;
    default:
      break;
    }
  }

  render() {
    const { children, monitorState } = this.props;
    const { position, isVisible } = monitorState;
    return (
      <Dock position={position}
            isVisible={isVisible}
            dimMode='none'>
        {children}
      </Dock>
    );
  }
}

const TOGGLE_VISIBILITY = '@@redux-devtools/dock/TOGGLE_VISIBILITY';
function toggleVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

const CHANGE_POSITION = '@@redux-devtools/dock/CHANGE_POSITION';
function changePosition() {
  return { type: CHANGE_POSITION };
}

export default function create(child, {
  defaultIsVisible = true,
  defaultPosition = 'right'
} = {}) {
  function position(state = defaultPosition, action) {
    return (action.type === CHANGE_POSITION) ?
      POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
      state;
  }

  function isVisible(state = defaultIsVisible, action) {
    return (action.type === TOGGLE_VISIBILITY) ?
      !state :
      state;
  }

  const ChildMonitor = child.component;
  const CompositeMonitor = ({ monitorState, monitorActions, ...rest }) => (
    <DockMonitor monitorState={monitorState}
                 monitorActions={monitorActions}>
      <ChildMonitor {...rest}
                    monitorState={monitorState.child}
                    monitorActions={monitorActions.child} />
    </DockMonitor>
  );

  return {
    component: CompositeMonitor,
    reducer: combineReducers({
      position,
      isVisible,
      child: child.reducer
    }),
    actionCreators: {
      toggleVisibility,
      changePosition,
      child: child.actionCreators
    }
  };
}
