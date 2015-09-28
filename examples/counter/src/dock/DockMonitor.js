//
// TODO: extract to a separate project.
//

import React, { cloneElement, Children, Component, PropTypes } from 'react';
import Dock from 'react-dock';
import { combineReducers } from 'redux';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

export default class DockMonitor extends Component {
  static propTypes = {
    defaultPosition: PropTypes.oneOf(POSITIONS).isRequired,
    defaultIsVisible: PropTypes.bool.isRequired,
    toggleVisibilityShortcut: PropTypes.string.isRequired,
    changePositionShortcut: PropTypes.string.isRequired,

    monitorState: PropTypes.shape({
      position: PropTypes.oneOf(POSITIONS).isRequired,
      isVisible: PropTypes.bool.isRequired,
      child: PropTypes.any
    }),

    monitorActions: PropTypes.shape({
      toggleVisibility: PropTypes.func.isRequired,
      changePosition: PropTypes.func.isRequired
    })
  };

  static defaultProps = {
    defaultIsVisible: true,
    defaultPosition: 'right',
    toggleVisibilityShortcut: 'H',
    changePositionShortcut: 'Q'
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
    switch (char.toUpperCase()) {
    case this.props.toggleVisibilityShortcut.toUpperCase():
      this.props.monitorActions.toggleVisibility();
      break;
    case this.props.changePositionShortcut.toUpperCase():
      this.props.monitorActions.changePosition();
      break;
    default:
      break;
    }
  }

  render() {
    const {
      monitorState,
      monitorActions,
      historyState,
      historyActions,
      children
    } = this.props;

    const {
      position,
      isVisible
    } = monitorState;

    return (
      <Dock position={position}
            isVisible={isVisible}
            dimMode='none'>
        {cloneElement(Children.only(children), {
          monitorState: monitorState.child,
          monitorActions: monitorActions.child,
          historyState,
          historyActions
        })}
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

DockMonitor.setup = function setup(props) {
  function position(state = props.defaultPosition, action) {
    return (action.type === CHANGE_POSITION) ?
      POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
      state;
  }

  function isVisible(state = props.defaultIsVisible, action) {
    return (action.type === TOGGLE_VISIBILITY) ?
      !state :
      state;
  }

  const child = Children.only(props.children);
  const childSetupResult = child.type.setup(child.props);

  return {
    reducer: combineReducers({
      position,
      isVisible,
      child: childSetupResult.reducer
    }),
    actionCreators: {
      toggleVisibility,
      changePosition,
      child: childSetupResult.actionCreators
    }
  };
}
