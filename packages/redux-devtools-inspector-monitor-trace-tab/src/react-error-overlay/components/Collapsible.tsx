/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, CSSProperties, ReactNode } from 'react';
import { base16Themes } from 'react-base16-styling';

const theme = base16Themes.nicinabox;

const _collapsibleStyle: CSSProperties = {
  color: theme.base06,
  backgroundColor: theme.base01,
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  fontSize: '1em',
  padding: '0px 5px',
  lineHeight: '1.5',
};

const collapsibleCollapsedStyle: CSSProperties = {
  ..._collapsibleStyle,
  marginBottom: '1.5em',
};

const collapsibleExpandedStyle: CSSProperties = {
  ..._collapsibleStyle,
  marginBottom: '0.6em',
};

interface Props {
  collapsedByDefault?: boolean;
  children: ReactNode[];
}

interface State {
  collapsed: boolean | undefined;
}

class Collapsible extends Component<Props, State> {
  state: State = {
    collapsed: undefined,
  };

  toggleCollapsed = () => {
    this.setState((state) => ({
      collapsed: !this.isCollapsed(state),
    }));
  };

  isCollapsed = (state: State) =>
    state.collapsed === undefined
      ? this.props.collapsedByDefault
      : state.collapsed;

  render() {
    const count = this.props.children.length;
    const collapsed = this.isCollapsed(this.state);
    return (
      <div>
        <button
          onClick={this.toggleCollapsed}
          style={
            collapsed ? collapsibleCollapsedStyle : collapsibleExpandedStyle
          }
        >
          {(collapsed ? '▶' : '▼') +
            ` ${count} stack frames were ` +
            (collapsed ? 'collapsed.' : 'expanded.')}
        </button>
        <div style={{ display: collapsed ? 'none' : 'block' }}>
          {this.props.children}
          <button
            onClick={this.toggleCollapsed}
            style={collapsibleExpandedStyle}
          >
            {`▲ ${count} stack frames were expanded.`}
          </button>
        </div>
      </div>
    );
  }
}

export default Collapsible;
