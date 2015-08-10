import React from 'react';
import JSONTree from './JSONTree';

const styles = {
  wrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid'
  },
  actionBar: {
    paddingTop: 6,
    paddingBottom: 4,
    paddingLeft: 10,
    marginBottom: 1
  },
  payload: {
    paddingLeft: 15
  }
};

export default class LogMonitorAction extends React.Component {

  renderPayload(payload) {
    return (
      <div style={{
        ...styles.payload,
        backgroundColor: this.props.theme.base01
      }}>
        { Object.keys(payload).length > 0 ? <JSONTree theme={this.props.theme} keyName={'payload'} data={payload}/> : '' }
      </div>
    );
  }

  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div style={{
        ...styles.wrapper,
        backgroundColor: this.props.theme.base02,
        borderTopColor: this.props.theme.base00,
        borderBottomColor: this.props.theme.base03,
        ...this.props.style
      }} onClick={this.props.onClick}>
        <div style={styles.actionBar}>{type}</div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
