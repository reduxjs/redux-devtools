import React, { ComponentProps, ReactNode } from 'react';
import JSONTree from 'react-json-tree';
import { DATA_TYPE_KEY } from '../monitor-config';
import { getJsonTreeTheme } from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer, getItemString } from '../styles/tree';
import { StyleUtils } from '../types';

export interface TreeViewProps extends StyleUtils {
  data: unknown;
  isWideLayout: boolean;
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  keyPath?: ComponentProps<typeof JSONTree>['keyPath'];
}

export class TreeView extends React.PureComponent<TreeViewProps> {
  readonly labelRenderer: ReturnType<typeof createTreeItemLabelRenderer>;

  constructor(props: TreeViewProps) {
    super(props);
    this.labelRenderer = createTreeItemLabelRenderer(this.props.styling);
  }

  render(): ReactNode {
    const {
      styling,
      base16Theme,
      invertTheme,
      isWideLayout,
      data,
      before,
      after,
      children,
      keyPath,
    } = this.props;

    return (
      <div {...styling('treeWrapper')}>
        {before}
        <JSONTree
          keyPath={keyPath}
          data={data}
          labelRenderer={this.labelRenderer}
          theme={getJsonTreeTheme(base16Theme)}
          invertTheme={invertTheme}
          getItemString={(type, data) =>
            getItemString(styling, type, data, DATA_TYPE_KEY, isWideLayout)
          }
          hideRoot
        />
        {after}
        {children}
      </div>
    );
  }
}
