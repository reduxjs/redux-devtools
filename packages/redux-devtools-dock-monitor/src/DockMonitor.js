import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import Dock from 'react-dock';
import { POSITIONS } from './constants';
import {
  toggleVisibility,
  changeMonitor,
  changePosition,
  changeSize
} from './actions';
import reducer from './reducers';
import parseKey from 'parse-key';

export default class DockMonitor extends Component {
  static update = reducer;

  static propTypes = {
    defaultPosition: PropTypes.oneOf(POSITIONS),
    defaultIsVisible: PropTypes.bool.isRequired,
    defaultSize: PropTypes.number.isRequired,
    toggleVisibilityKey: PropTypes.string.isRequired,
    changePositionKey: PropTypes.string.isRequired,
    changeMonitorKey: PropTypes.string,
    fluid: PropTypes.bool,

    dispatch: PropTypes.func,
    monitorState: PropTypes.shape({
      position: PropTypes.oneOf(POSITIONS).isRequired,
      size: PropTypes.number.isRequired,
      isVisible: PropTypes.bool.isRequired,
      childMonitorState: PropTypes.any
    })
  };

  static defaultProps = {
    defaultIsVisible: true,
    defaultPosition: 'right',
    defaultSize: 0.3,
    fluid: true
  };

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);

    const childrenCount = Children.count(props.children);
    if (childrenCount === 0) {
      // eslint-disable-next-line no-console
      console.error(
        '<DockMonitor> requires at least one monitor inside. ' +
          'Why don’t you try <LogMonitor>? You can get it at ' +
          'https://github.com/gaearon/redux-devtools-log-monitor.'
      );
    } else if (childrenCount > 1 && !props.changeMonitorKey) {
      // eslint-disable-next-line no-console
      console.error(
        'You specified multiple monitors inside <DockMonitor> ' +
          'but did not provide `changeMonitorKey` prop to change them. ' +
          'Try specifying <DockMonitor changeMonitorKey="ctrl-m" /> ' +
          'and then press Ctrl-M.'
      );
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  matchesKey(key, event) {
    if (!key) {
      return false;
    }

    const charCode = event.keyCode || event.which;
    const char = String.fromCharCode(charCode);
    return (
      key.name.toUpperCase() === char.toUpperCase() &&
      key.alt === event.altKey &&
      key.ctrl === event.ctrlKey &&
      key.meta === event.metaKey &&
      key.shift === event.shiftKey
    );
  }

  handleKeyDown(e) {
    // Ignore regular keys when focused on a field
    // and no modifiers are active.
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable)
    ) {
      return;
    }

    const visibilityKey = parseKey(this.props.toggleVisibilityKey);
    const positionKey = parseKey(this.props.changePositionKey);

    let monitorKey;
    if (this.props.changeMonitorKey) {
      monitorKey = parseKey(this.props.changeMonitorKey);
    }

    if (this.matchesKey(visibilityKey, e)) {
      e.preventDefault();
      this.props.dispatch(toggleVisibility());
    } else if (this.matchesKey(positionKey, e)) {
      e.preventDefault();
      this.props.dispatch(changePosition());
    } else if (this.matchesKey(monitorKey, e)) {
      e.preventDefault();
      this.props.dispatch(changeMonitor());
    }
  }

  handleSizeChange(requestedSize) {
    this.props.dispatch(changeSize(requestedSize));
  }

  renderChild(child, index, otherProps) {
    const { monitorState } = this.props;
    const { childMonitorIndex, childMonitorStates } = monitorState;

    if (index !== childMonitorIndex) {
      return null;
    }

    return cloneElement(child, {
      monitorState: childMonitorStates[index],
      ...otherProps
    });
  }

  render() {
    const { monitorState, children, fluid, ...rest } = this.props;
    const { position, isVisible, size } = monitorState;

    return (
      <Dock
        position={position}
        isVisible={isVisible}
        size={size}
        fluid={fluid}
        onSizeChange={this.handleSizeChange}
        dimMode="none"
      >
        {Children.map(children, (child, index) =>
          this.renderChild(child, index, rest)
        )}
      </Dock>
    );
  }
}
