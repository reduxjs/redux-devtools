import type { ReactNode } from 'react';
import React, { PureComponent } from 'react';
import type { ShouldExpandNodeInitially } from 'react-json-tree';
import type { RtkResourceInfo } from '../types.js';
import { QueryPreviewTabs } from '../types.js';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y.js';
import type { TreeViewProps } from './TreeView.js';
import { TreeView } from './TreeView.js';

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
  shouldExpandNodeInitially: ShouldExpandNodeInitially = (
    keyPath,
    value,
    layer,
  ) => {
    return layer <= 1;
  };

  render(): ReactNode {
    const { data, isWideLayout } = this.props;

    return (
      <TreeView
        rootProps={rootProps}
        data={data}
        isWideLayout={isWideLayout}
        shouldExpandNodeInitially={this.shouldExpandNodeInitially}
      />
    );
  }
}
