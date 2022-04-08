import React, { ReactNode, PureComponent } from 'react';
import { RtkResourceInfo } from '../types';
import { TreeView } from './TreeView';

export interface QueryPreviewDataProps {
  data: RtkResourceInfo['state']['data'];
  isWideLayout: boolean;
}
export class QueryPreviewData extends PureComponent<QueryPreviewDataProps> {
  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    const lastKey = keyPath[keyPath.length - 1];

    return layer <= 1 && lastKey !== 'query' && lastKey !== 'mutation';
  };

  render(): ReactNode {
    const { data, isWideLayout } = this.props;

    return (
      <TreeView
        data={data}
        isWideLayout={isWideLayout}
        shouldExpandNode={this.shouldExpandNode}
      />
    );
  }
}
