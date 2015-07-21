import React, { PropTypes } from 'react';

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
    zIndex: 999,
    fontSize: 17,
    overflow: 'auto',
    opacity: 0.92,
    background: 'black',
    color: 'white',
    left: left ? 0 : undefined,
    right: right ? 0 : undefined,
    top: top ? 0 : undefined,
    bottom: bottom ? 0 : undefined,
    maxHeight: (bottom && top) ? '100%' : '20%',
    maxWidth: (left && right) ? '100%' : '20%',
    wordWrap: 'break-word'
  };
}

export default class DebugPanel {
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
