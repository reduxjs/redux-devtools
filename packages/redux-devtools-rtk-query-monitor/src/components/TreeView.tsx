import { createSelector, Selector } from '@reduxjs/toolkit';
import React, { ComponentProps, ReactNode } from 'react';
import { JSONTree } from 'react-json-tree';
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
  rootProps?: Partial<
    Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>
  >;
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

  readonly selectLabelRenderer: Selector<
    StylingFunction,
    ReturnType<typeof createTreeItemLabelRenderer>,
    never
  > = createSelector<
    [(stylingFunction: StylingFunction) => StylingFunction],
    ReturnType<typeof createTreeItemLabelRenderer>
  >(identity, createTreeItemLabelRenderer);

  readonly selectGetItemString: Selector<
    StylingFunction,
    (type: string, data: unknown) => ReactNode,
    never
  > = createSelector<
    [(stylingFunction: StylingFunction) => StylingFunction],
    (type: string, data: unknown) => ReactNode
  >(
    identity,
    (styling) => (type, data) =>
      getItemString(styling, type, data, DATA_TYPE_KEY, false)
  );

  readonly selectTheme: Selector<
    Base16Theme,
    ReturnType<typeof getJsonTreeTheme>,
    never
  > = createSelector<
    [(base16Theme: Base16Theme) => Base16Theme],
    ReturnType<typeof getJsonTreeTheme>
  >(identity, getJsonTreeTheme);

  constructor(props: TreeViewProps) {
    super(props);
  }

  render(): ReactNode {
    const {
      data,
      before,
      after,
      children,
      keyPath,
      shouldExpandNode,
      hideRoot,
      rootProps,
    } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, invertTheme, base16Theme }) => {
          return (
            <div {...rootProps} {...styling('treeWrapper')}>
              {before}
              <JSONTree
                keyPath={keyPath}
                shouldExpandNode={shouldExpandNode}
                data={data}
                labelRenderer={this.selectLabelRenderer(styling)}
                theme={this.selectTheme(base16Theme)}
                invertTheme={invertTheme}
                getItemString={this.selectGetItemString(styling)}
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
