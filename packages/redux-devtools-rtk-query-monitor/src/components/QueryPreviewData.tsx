import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabs, RtkResourceInfo } from '../types';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y';
import { TreeView, TreeViewProps } from './TreeView';

export interface QueryPreviewDataProps {
  data: RtkResourceInfo['state']['data'];
  isWideLayout: boolean;
}

const rootProps: TreeViewProps['rootProps'] = {
  'aria-labelledby': renderTabPanelButtonId(QueryPreviewTabs.data),
  id: renderTabPanelId(QueryPreviewTabs.data),
  role: 'tabpanel',
};

export class QueryPreviewData extends PureComponent<QueryPreviewDataProps> {
  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    return layer <= 1;
  };

  render(): ReactNode {
    const { data, isWideLayout } = this.props;

    return (
      <TreeView
        rootProps={rootProps}
        data={data}
        isWideLayout={isWideLayout}
        shouldExpandNode={this.shouldExpandNode}
      />
    );
  }
}
