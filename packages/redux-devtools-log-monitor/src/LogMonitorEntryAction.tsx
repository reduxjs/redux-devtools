import React, { Component, CSSProperties, MouseEventHandler } from 'react';
import { JSONTree } from 'react-json-tree';
import type { ShouldExpandNodeInitially } from 'react-json-tree';
import type { Base16Theme } from 'react-base16-styling';
import { Action } from 'redux';

const styles = {
  actionBar: {
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 16,
  },
  payload: {
    margin: 0,
    paddingLeft: 16,
    overflow: 'auto',
  },
};

interface Props<A extends Action<string>> {
  theme: Base16Theme;
  collapsed: boolean;
  action: A;
  expandActionRoot: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  style: CSSProperties;
}

export default class LogMonitorAction<
  A extends Action<string>,
> extends Component<Props<A>> {
  renderPayload(payload: Record<string, unknown>) {
    return (
      <div
        style={{
          ...styles.payload,
          backgroundColor: this.props.theme.base00,
        }}
      >
        {Object.keys(payload).length > 0 ? (
          <JSONTree
            theme={this.props.theme}
            invertTheme={false}
            keyPath={['action']}
            data={payload}
            shouldExpandNodeInitially={this.shouldExpandNodeInitially}
          />
        ) : (
          ''
        )}
      </div>
    );
  }

  shouldExpandNodeInitially: ShouldExpandNodeInitially = (
    keyPath,
    data,
    level,
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
          ...this.props.style,
        }}
      >
        <div style={styles.actionBar} onClick={this.props.onClick}>
          {type !== null && type.toString()}
        </div>
        {!this.props.collapsed ? this.renderPayload(payload) : ''}
      </div>
    );
  }
}
