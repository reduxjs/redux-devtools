import type { ReactNode } from 'react';
import React, { PureComponent } from 'react';
import type { RtkQueryApiState } from '../types.js';
import { QueryPreviewTabs } from '../types.js';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y.js';
import type { TreeViewProps } from './TreeView.js';
import { TreeView } from './TreeView.js';

const rootProps: TreeViewProps['rootProps'] = {
  'aria-labelledby': renderTabPanelButtonId(
    QueryPreviewTabs.querySubscriptions,
  ),
  id: renderTabPanelId(QueryPreviewTabs.querySubscriptions),
  role: 'tabpanel',
};

export interface QueryPreviewSubscriptionsProps {
  subscriptions: RtkQueryApiState['subscriptions'][keyof RtkQueryApiState['subscriptions']];
  isWideLayout: boolean;
}

export class QueryPreviewSubscriptions extends PureComponent<QueryPreviewSubscriptionsProps> {
  render(): ReactNode {
    const { subscriptions } = this.props;

    return (
      <TreeView
        rootProps={rootProps}
        data={subscriptions}
        isWideLayout={this.props.isWideLayout}
      />
    );
  }
}
