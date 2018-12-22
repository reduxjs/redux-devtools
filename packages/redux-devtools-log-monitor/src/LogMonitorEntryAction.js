import React, { Component } from 'react';
import JSONTree from 'react-json-tree';

const styles = {
  actionBar: {
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 16
  },
  payload: {
    margin: 0,
    paddingLeft: 16,
    overflow: 'auto'
  }
};

export default class LogMonitorAction extends Component {
  constructor(props) {
    super(props);
    this.shouldExpandNode = this.shouldExpandNode.bind(this);
  }

  renderPayload(payload) {
    return (
      <div style={{
        ...styles.payload,
        backgroundColor: this.props.theme.base00
      }}>
        { Object.keys(payload).length > 0 ?
          <JSONTree theme={this.props.theme}
                    invertTheme={false}
                    keyPath={['action']}
                    data={payload}
                    shouldExpandNode={this.shouldExpandNode} /> : '' }
      </div>
    );
  }

  shouldExpandNode(keyName, data, level) {
    return this.props.expandActionRoot && level === 0;
  }

  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div style={{
        backgroundColor: this.props.theme.base02,
        color: this.props.theme.base06,
        ...this.props.style
      }}>
        <div style={styles.actionBar}
          onClick={this.props.onClick}>
          {type !== null && type.toString()}
        </div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
