import React from "react";
import JSONTree from './JSONTree';

const styles = {
  wrapper: {
    backgroundColor: '#343c45',
    borderTop: '1px solid #3f464d',
    borderBottom: '1px solid #3f464d'
  },
  actionBar: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    marginBottom: 1
  },
  payload: {
    backgroundColor: '#252c33',
    paddingLeft: 15
  }
}
export default class LogMonitorAction extends React.Component {
  renderPayload(payload) {
    return (
      <div style={styles.payload}>
        { Object.keys(payload).length > 0 ? <JSONTree keyName={'payload'} data={payload}/> : "" }
      </div>
    );
  }
  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div style={{...styles.wrapper, ...this.props.style}} onClick={this.props.onClick}>
        <div style={styles.actionBar}>{type}</div>
        {!this.props.collapsed ? '' : ''}
      </div>
    );
  }
}