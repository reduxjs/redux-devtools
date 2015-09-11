import React, { PropTypes, Component } from 'react';

export function getDefaultStyle(props) {
  let { left, right, bottom, top } = props;
  if (typeof left === 'undefined' && typeof right === 'undefined') {
    right = true;
  }
  if (typeof top === 'undefined' && typeof bottom === 'undefined') {
    bottom = true;
  }

  return {
    position: 'fixed',
    zIndex: 10000,
    fontSize: 17,
    overflow: 'hidden',
    opacity: 1,
    color: 'white',
    left: left ? 0 : undefined,
    right: right ? 0 : undefined,
    top: top ? 0 : undefined,
    bottom: bottom ? 0 : undefined,
    maxHeight: (bottom && top) ? '100%' : '30%',
    maxWidth: (left && right) ? '100%' : '30%',
    wordWrap: 'break-word',
    boxSizing: 'border-box',
    boxShadow: '-2px 0 7px 0 rgba(0, 0, 0, 0.5)'
  };
}

export default class DebugPanel extends Component {
  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    top: PropTypes.bool,
    getStyle: PropTypes.func.isRequired
  };

  static defaultProps = {
    getStyle: getDefaultStyle
  };

  render() {
    return (
      <div style={{...this.props.getStyle(this.props), ...this.props.style}}>
        {this.props.children}
      </div>
    );
  }
}
