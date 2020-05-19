import React, { Component, MouseEventHandler } from 'react';
import JSONTree from 'react-json-tree';
import { Action } from 'redux';
import { Base16Theme } from 'base16';

const styles: {
  actionBar: React.CSSProperties;
  payload: React.CSSProperties;
} = {
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

interface Props<A extends Action<unknown>> {
  theme: Base16Theme;
  collapsed: boolean;
  action: A;
  expandActionRoot: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  style: React.CSSProperties;
}

export default class LogMonitorAction<
  A extends Action<unknown>
> extends Component<Props<A>> {
  renderPayload(payload: {}) {
    return (
      <div
        style={{
          ...styles.payload,
          backgroundColor: this.props.theme.base00
        }}
      >
        {Object.keys(payload).length > 0 ? (
          <JSONTree
            theme={this.props.theme}
            invertTheme={false}
            keyPath={['action']}
            data={payload}
            shouldExpandNode={this.shouldExpandNode}
          />
        ) : (
          ''
        )}
      </div>
    );
  }

  shouldExpandNode = (
    keyName: (string | number)[],
    data: unknown,
    level: number
  ) => {
    return this.props.expandActionRoot && level === 0;
  };

  render() {
    const { type, ...payload } = this.props.action;
    return (
      <div
        style={{
          backgroundColor: this.props.theme.base02,
          color: this.props.theme.base06,
          ...this.props.style
        }}
      >
        <div style={styles.actionBar} onClick={this.props.onClick}>
          {type !== null && (type as any).toString()}
        </div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
