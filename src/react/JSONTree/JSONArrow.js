import React from 'react';

const styles = {
  base: {
    display: 'inline-block',
    marginLeft: 0,
    marginTop: 8,
    marginRight: 5,
    'float': 'left',
    transition: '150ms',
    WebkitTransition: '150ms',
    MozTransition: '150ms',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTopWidth: 5,
    borderTopStyle: 'solid',
    WebkitTransform: 'rotateZ(-90deg)',
    MozTransform: 'rotateZ(-90deg)',
    transform: 'rotateZ(-90deg)'
  },
  open: {
    WebkitTransform: 'rotateZ(0deg)',
    MozTransform: 'rotateZ(0deg)',
    transform: 'rotateZ(0deg)'
  }
};

export default class JSONArrow extends React.Component {
  render() {
    let style = {
      ...styles.base,
      borderTopColor: this.props.theme.base0D
    };
    if (this.props.open) {
      style = {
        ...style,
        ...styles.open
      };
    }
    return <div style={style} onClick={this.props.onClick}/>;
  }
}
