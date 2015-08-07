import React from 'react';
import reactMixin from 'react-mixin';
import { SquashClickEventMixin } from './mixins';

const styles = {
  base: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 4,
    letterSpacing: 1,
    marginLeft: 10
  },
  label: {
    display: 'inline-block',
    marginRight: 5,
    color: '#8fa1b2'
  },
  value: {
    color: '#717c93'
  }
};

@reactMixin.decorate(SquashClickEventMixin)
export default class JSONStringNode extends React.Component {
  render() {
    return (
      <li style={styles.base} onClick={::this.handleClick}>
        <label style={styles.label}>{this.props.keyName}:</label>
        <span style={styles.value}>{this.props.value}</span>
      </li>
    );
  }
}
