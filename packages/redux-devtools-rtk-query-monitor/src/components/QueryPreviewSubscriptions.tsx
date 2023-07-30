import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabs, RtkQueryApiState } from '../types';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y';
import { TreeView, TreeViewProps } from './TreeView';

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
