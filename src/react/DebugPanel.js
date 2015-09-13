import React, { PropTypes, Component } from 'react';
import Dock from 'react-dock';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

export default class DebugPanel extends Component {
  static propTypes = {
    getStyle: PropTypes.func.isRequired
  };

  static defaultProps = {
    getStyle: () => ({}),
    panelState: {
      position: 'right',
      isVisible: true
    },
    visibleOnLoad: true,
    position: 'right',
    dimMode: 'none'
  };

  componentWillMount() {
    const { panelState, visibleOnLoad, position } = this.props;

    this.props.setPanelState({
      ...panelState,
      isVisible: visibleOnLoad,
      position: position
    });
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  render() {
    const { getStyle, dimMode, panelState: { position, isVisible } } = this.props;
    return (
      <Dock style={{...getStyle(this.props)}}
            {...{ dimMode, position, isVisible }}>
        {this.props.children}
      </Dock>
    );
  }

  handleKeyPress = event => {
    const { panelState } = this.props;
    if (event.ctrlKey && event.keyCode === 72) { // Ctrl+H
      event.preventDefault();
      this.props.setPanelState({
        ...panelState,
        isVisible: !panelState.isVisible
      });
    } else if (event.ctrlKey && event.keyCode === 68) { // Ctrl+D
      event.preventDefault();
      const positionIdx = POSITIONS.indexOf(panelState.position);
      this.props.setPanelState({
        ...panelState,
        position: POSITIONS[(positionIdx + 1) % POSITIONS.length]
      });
    }
  }
}
