import { createSelector, Selector } from '@reduxjs/toolkit';
import React, { ComponentProps, ReactNode } from 'react';
import { JSONTree } from 'react-json-tree';
import { Base16Theme } from 'react-base16-styling';
import { getJsonTreeTheme, StyleUtilsContext } from '../styles/themes';
import { getItemString, labelRenderer } from '../styles/tree';
import { identity } from '../utils/object';

export interface TreeViewProps
  extends Partial<
    Pick<
      ComponentProps<typeof JSONTree>,
      'keyPath' | 'shouldExpandNodeInitially' | 'hideRoot'
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
    shouldExpandNodeInitially: (
      keyPath: (string | number)[],
      value: unknown,
      layer: number,
    ): boolean => {
      return layer < 2;
    },
  };

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
      shouldExpandNodeInitially,
      hideRoot,
      rootProps,
    } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ invertTheme, base16Theme }) => {
          return (
            <div
              {...rootProps}
              css={{
                overflowX: 'auto',
                overflowY: 'auto',
                padding: '0.5em 1em',
              }}
            >
              {before}
              <JSONTree
                keyPath={keyPath}
                shouldExpandNodeInitially={shouldExpandNodeInitially}
                data={data}
                labelRenderer={labelRenderer}
                theme={this.selectTheme(base16Theme)}
                invertTheme={invertTheme}
                getItemString={getItemString}
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
