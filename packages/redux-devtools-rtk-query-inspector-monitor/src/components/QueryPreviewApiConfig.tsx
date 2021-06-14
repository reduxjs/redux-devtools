import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabProps } from '../types';
import { TreeView } from './TreeView';

export class QueryPreviewApiConfig extends PureComponent<QueryPreviewTabProps> {
  render(): ReactNode {
    const {
      queryInfo,
      isWideLayout,
      base16Theme,
      styling,
      invertTheme,
      apiConfig,
    } = this.props;

    if (!queryInfo) {
      return null;
    }

    return (
      <TreeView
        data={apiConfig}
        isWideLayout={isWideLayout}
        base16Theme={base16Theme}
        styling={styling}
        invertTheme={invertTheme}
      />
    );
  }
}
