import { createSelector } from '@reduxjs/toolkit';
import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabProps } from '../types';
import { TreeView } from './TreeView';

interface TreeDisplayed {
  reducerPath: string;
  api: QueryPreviewTabProps['apiState'];
  stats: QueryPreviewTabProps['apiStats'];
}
export class QueryPreviewApi extends PureComponent<QueryPreviewTabProps> {
  selectData = createSelector(
    [
      ({ apiState }: QueryPreviewTabProps) => apiState,
      ({ apiStats }: QueryPreviewTabProps) => apiStats,
    ],
    (apiState, apiStats) => ({
      reducerPath: apiState?.config?.reducerPath ?? null,
      apiState: apiState,
      stats: apiStats,
    })
  );

  render(): ReactNode {
    const { queryInfo, isWideLayout, base16Theme, styling, invertTheme } =
      this.props;

    if (!queryInfo) {
      return null;
    }

    return (
      <TreeView
        data={this.selectData(this.props)}
        isWideLayout={isWideLayout}
        base16Theme={base16Theme}
        styling={styling}
        invertTheme={invertTheme}
      />
    );
  }
}
