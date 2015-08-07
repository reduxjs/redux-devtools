import React from 'react';

const styles = {
  base: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 2,
    display: 'inline-block',
    fontSize: "0.8em"
  },
  active: {
    backgroundColor: "#252c33"
  }
}

export default class LogMonitorButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      active: false
    }
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

  render() {
    let style = {
      ...styles.base,
    };
    if (this.state.hovered) {
      style = {
        ...style,
        ...styles.active
      };
    }
    return (
      <a onMouseEnter={::this.handleMouseEnter}
          onMouseLeave={::this.handleMouseLeave}
          onMouseDown={::this.handleMouseDown}
          onMouseUp={::this.handleMouseUp}
          style={style} onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  }
}
