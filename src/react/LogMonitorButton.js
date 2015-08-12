import React from 'react';
import brighten from '../utils/brighten';

const styles = {
  base: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: 3,
    padding: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
    flexGrow: 1,
    display: 'inline-block',
    fontSize: '0.8em'
  }
};

export default class LogMonitorButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      active: false
    };
  }

  handleMouseEnter() {
    this.setState({ hovered: true });
  }

  handleMouseLeave() {
    this.setState({ hovered: false });
  }

  handleMouseDown() {
    this.setState({ active: true });
  }

  handleMouseUp() {
    this.setState({ active: false });
  }

  onClick() {
    if (!this.props.enabled) {
      return;
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    let style = {
      ...styles.base,
      backgroundColor: this.props.theme.base02
    };
    if (this.props.enabled && this.state.hovered) {
      style = {
        ...style,
        backgroundColor: brighten(this.props.theme.base02, 0.2)
      };
    }
    if (!this.props.enabled) {
      style = {
        ...style,
        opacity: 0.2,
        cursor: 'text',
        backgroundColor: 'transparent'
      };
    }
    return (
      <a onMouseEnter={::this.handleMouseEnter}
          onMouseLeave={::this.handleMouseLeave}
          onMouseDown={::this.handleMouseDown}
          onMouseUp={::this.handleMouseUp}
          style={style} onClick={::this.onClick}>
        {this.props.children}
      </a>
    );
  }
}
