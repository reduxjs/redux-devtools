import React from 'react';

const styles = {
  base: {
    marginTop: 5,
    marginLeft: 4,
    minWidth: 40,
    paddingLeft: 6,
    paddingRight: 6,
    height: 30,
    borderRadius: 4,
    lineHeight: "30px",
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
      backgroundColor: this.props.theme.base01
    };
    if (this.props.enabled && this.state.hovered) {
      style = {
        ...style,
        backgroundColor: this.props.theme.base00
      };
    }
    if (!this.props.enabled) {
      style = {
        ...style,
        opacity: 0.5
      }
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
