import React, { ReactNode, PureComponent } from 'react';
import { AnyAction } from 'redux';
import { TreeView } from './TreeView';

export interface QueryPreviewActionsProps {
  isWideLayout: boolean;
  actionsOfQuery: AnyAction[];
}

export class QueryPreviewActions extends PureComponent<QueryPreviewActionsProps> {
  render(): ReactNode {
    const { isWideLayout, actionsOfQuery } = this.props;

    return <TreeView data={actionsOfQuery} isWideLayout={isWideLayout} />;
  }
}
