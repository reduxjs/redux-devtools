import React from 'react';
import JSONTree from './JSONTree';

const styles = {
  actionBar: {
    paddingTop: 7,
    paddingBottom: 6,
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
        { Object.keys(payload).length > 0 ? <JSONTree theme={this.props.theme} keyName={'action'} data={payload}/> : '' }
      </div>
    );
  }

  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div style={{
        backgroundColor: this.props.theme.base02,
        color: this.props.theme.base06,
        ...this.props.style
      }} onClick={this.props.onClick}>
        <div style={styles.actionBar}>{type}</div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
