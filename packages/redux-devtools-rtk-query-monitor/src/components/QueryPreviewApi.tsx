import { createSelector } from '@reduxjs/toolkit';
import React, { ReactNode, PureComponent } from 'react';
import { ApiStats, RtkQueryApiState } from '../types';
import { TreeView } from './TreeView';

export interface QueryPreviewApiProps {
  apiStats: ApiStats | null;
  apiState: RtkQueryApiState | null;
  isWideLayout: boolean;
}

export class QueryPreviewApi extends PureComponent<QueryPreviewApiProps> {
  selectData = createSelector(
    [
      ({ apiState }: QueryPreviewApiProps) => apiState,
      ({ apiStats }: QueryPreviewApiProps) => apiStats,
    ],
    (apiState, apiStats) => ({
      reducerPath: apiState?.config?.reducerPath ?? null,
      apiState: apiState,
      stats: apiStats,
    })
  );

  render(): ReactNode {
    return (
      <TreeView
        data={this.selectData(this.props)}
        isWideLayout={this.props.isWideLayout}
      />
    );
  }
}
