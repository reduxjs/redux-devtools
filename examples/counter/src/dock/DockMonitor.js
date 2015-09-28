//
// TODO: extract to a separate project.
//

import React, { Component, PropTypes } from 'react';
import Dock from 'react-dock';
import MapProvider from './MapProvider';
import { connect } from 'react-redux';
import { combineReducers } from 'redux';

const TOGGLE_VISIBILITY = '@@redux-devtools/dock/TOGGLE_VISIBILITY';
function toggleVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

const CHANGE_POSITION = '@@redux-devtools/dock/CHANGE_POSITION';
function changePosition() {
  return { type: CHANGE_POSITION };
}

const POSITIONS = ['left', 'top', 'right', 'bottom'];

function wrapReducer(options = {}) {
  const {
    isVisible: initialIsVisible = true,
    position: initialPosition = 'right'
  } = options;

  function position(state = initialPosition, action) {
    return (action.type === CHANGE_POSITION) ?
      POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
      state;
  }

  function isVisible(state = initialIsVisible, action) {
    return (action.type === TOGGLE_VISIBILITY) ?
      !state :
      state;
  }

  return childMonitorReducer => combineReducers({
    childMonitorState: childMonitorReducer,
    position,
    isVisible
  });
}

function mapUpstreamStateToDownstreamState(state) {
  return {
    devToolsState: state.devToolsState,
    monitorState: state.monitorState.childMonitorState
  };
}

@connect(
  state => state.monitorState,
  { toggleVisibility, changePosition }
)
export default class DockMonitor extends Component {
  static propTypes = {
    position: PropTypes.oneOf(['left', 'top', 'right', 'bottom']).isRequired,
    isVisible: PropTypes.bool.isRequired,
    childMonitorState: PropTypes.any,
    toggleVisibility: PropTypes.func.isRequired,
    changePosition: PropTypes.func.isRequired
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
      this.props.toggleVisibility();
      break;
    case 'D':
      this.props.changePosition();
      break;
    default:
      break;
    }
  }

  render() {
    const { position, isVisible, children } = this.props;
    return (
      <Dock position={position}
            isVisible={isVisible}
            dimMode='none'>
        <MapProvider mapState={mapUpstreamStateToDownstreamState}>
          {children}
        </MapProvider>
      </Dock>
    );
  }
}

DockMonitor.wrapReducer = wrapReducer;
