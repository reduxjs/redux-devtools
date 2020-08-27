import React, { CSSProperties } from 'react';
import { Base16Theme } from 'redux-devtools-themes';
import brighten from './brighten';

const styles: { base: CSSProperties } = {
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
    fontSize: '0.8em',
    color: 'white',
    textDecoration: 'none',
  },
};

interface State {
  hovered: boolean;
  active: boolean;
}

interface Props {
  theme: Base16Theme;
  onClick: () => void;
  enabled: boolean;
}

export default class LogMonitorButton extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    hovered: false,
    active: false,
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handleMouseDown = () => {
    this.setState({ active: true });
  };

  handleMouseUp = () => {
    this.setState({ active: false });
  };

  onClick = () => {
    if (!this.props.enabled) {
      return;
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    let style = {
      ...styles.base,
      backgroundColor: this.props.theme.base02,
    };
    if (this.props.enabled && this.state.hovered) {
      style = {
        ...style,
        backgroundColor: brighten(this.props.theme.base02, 0.2),
      };
    }
    if (!this.props.enabled) {
      style = {
        ...style,
        opacity: 0.2,
        cursor: 'text',
        backgroundColor: 'transparent',
      };
    }
    return (
      <a
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.onClick}
        style={style}
      >
        {this.props.children}
      </a>
    );
  }
}
