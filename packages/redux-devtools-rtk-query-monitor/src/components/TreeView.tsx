import { createSelector } from '@reduxjs/toolkit';
import React, { ComponentProps, ReactNode } from 'react';
import JSONTree from 'react-json-tree';
import { StylingFunction } from 'react-base16-styling';
import { DATA_TYPE_KEY } from '../monitor-config';
import {
  getJsonTreeTheme,
  StyleUtilsContext,
} from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer, getItemString } from '../styles/tree';
import { identity } from '../utils/object';

export interface TreeViewProps {
  data: unknown;
  isWideLayout: boolean;
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  keyPath?: ComponentProps<typeof JSONTree>['keyPath'];
}

export class TreeView extends React.PureComponent<TreeViewProps> {
  readonly selectLabelRenderer = createSelector<
    StylingFunction,
    StylingFunction,
    ReturnType<typeof createTreeItemLabelRenderer>
  >(identity, createTreeItemLabelRenderer);

  constructor(props: TreeViewProps) {
    super(props);
  }

  render(): ReactNode {
    const { isWideLayout, data, before, after, children, keyPath } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, invertTheme, base16Theme }) => {
          return (
            <div {...styling('treeWrapper')}>
              {before}
              <JSONTree
                keyPath={keyPath}
                data={data}
                labelRenderer={this.selectLabelRenderer(styling)}
                theme={getJsonTreeTheme(base16Theme)}
                invertTheme={invertTheme}
                getItemString={(type, data) =>
                  getItemString(
                    styling,
                    type,
                    data,
                    DATA_TYPE_KEY,
                    isWideLayout
                  )
                }
                hideRoot
              />
              {after}
              {children}
            </div>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
