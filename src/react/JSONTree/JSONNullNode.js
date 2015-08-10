import React from 'react';
import reactMixin from 'react-mixin';
import { SquashClickEventMixin } from './mixins';
import hexToRgb from '../../utils/hexToRgb';

const styles = {
  base: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 4,
    marginLeft: 10
  },
  label: {
    display: 'inline-block',
    marginRight: 5
  }
};

@reactMixin.decorate(SquashClickEventMixin)
export default class JSONNullNode extends React.Component {
  render() {
    let backgroundColor = 'transparent';
    if (this.props.previousValue !== this.props.value) {
      const bgColor = hexToRgb(this.props.theme.base08);
      backgroundColor = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.04)`;
    }
    return (
      <li style={{ ...styles.base, backgroundColor }} onClick={::this.handleClick}>
        <label style={{
          ...styles.label,
          color: this.props.theme.base0D
        }}>
          {this.props.keyName}:
        </label>
        <span style={{ color: this.props.theme.base08 }}>null</span>
      </li>
    );
  }
}
