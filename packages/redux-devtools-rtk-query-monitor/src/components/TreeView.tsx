import { createSelector } from '@reduxjs/toolkit';
import React, { ComponentProps, ReactNode } from 'react';
import JSONTree from 'react-json-tree';
import { Base16Theme, StylingFunction } from 'react-base16-styling';
import { DATA_TYPE_KEY } from '../monitor-config';
import {
  getJsonTreeTheme,
  StyleUtilsContext,
} from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer, getItemString } from '../styles/tree';
import { identity } from '../utils/object';

export interface TreeViewProps
  extends Partial<
    Pick<
      ComponentProps<typeof JSONTree>,
      'keyPath' | 'shouldExpandNode' | 'hideRoot'
    >
  > {
  data: unknown;
  isWideLayout: boolean;
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
}

export class TreeView extends React.PureComponent<TreeViewProps> {
  static defaultProps = {
    hideRoot: true,
    shouldExpandNode: (
      keyPath: (string | number)[],
      value: unknown,
      layer: number
    ): boolean => {
      return layer < 2;
    },
  };

  readonly selectLabelRenderer = createSelector<
    StylingFunction,
    StylingFunction,
    ReturnType<typeof createTreeItemLabelRenderer>
  >(identity, createTreeItemLabelRenderer);

  readonly selectGetItemString = createSelector(
    [
      (styling: StylingFunction, _: boolean) => styling,
      (_: StylingFunction, isWideLayout: boolean) => isWideLayout,
    ],
    (styling, isWideLayout) => (type: string, data: any) =>
      getItemString(styling, type, data, DATA_TYPE_KEY, isWideLayout)
  );

  readonly selectTheme = createSelector<
    Base16Theme,
    Base16Theme,
    ReturnType<typeof getJsonTreeTheme>
  >(identity, getJsonTreeTheme);

  constructor(props: TreeViewProps) {
    super(props);
  }

  render(): ReactNode {
    const {
      isWideLayout,
      data,
      before,
      after,
      children,
      keyPath,
      shouldExpandNode,
      hideRoot,
    } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, invertTheme, base16Theme }) => {
          return (
            <div {...styling('treeWrapper')}>
              {before}
              <JSONTree
                keyPath={keyPath}
                shouldExpandNode={shouldExpandNode}
                data={data}
                labelRenderer={this.selectLabelRenderer(styling)}
                theme={this.selectTheme(base16Theme)}
                invertTheme={invertTheme}
                getItemString={this.selectGetItemString(styling, isWideLayout)}
                hideRoot={hideRoot}
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
