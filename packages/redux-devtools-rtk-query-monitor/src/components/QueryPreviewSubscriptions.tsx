import React, { ReactNode, PureComponent } from 'react';
import { RtkQueryApiState } from '../types';
import { TreeView } from './TreeView';

export interface QueryPreviewSubscriptionsProps {
  subscriptions: RtkQueryApiState['subscriptions'][keyof RtkQueryApiState['subscriptions']];
  isWideLayout: boolean;
}

export class QueryPreviewSubscriptions extends PureComponent<QueryPreviewSubscriptionsProps> {
  render(): ReactNode {
    const { subscriptions } = this.props;

    return (
      <TreeView data={subscriptions} isWideLayout={this.props.isWideLayout} />
    );
  }
}
