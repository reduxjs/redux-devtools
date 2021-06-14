import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabProps } from '../types';
import { TreeView } from './TreeView';

export class QueryPreviewSubscriptions extends PureComponent<
  QueryPreviewTabProps
> {
  render(): ReactNode {
    const {
      queryInfo,
      isWideLayout,
      base16Theme,
      styling,
      invertTheme,
      querySubscriptions,
    } = this.props;

    if (!querySubscriptions || !queryInfo) {
      return null;
    }

    return (
      <>
        <TreeView
          data={querySubscriptions}
          isWideLayout={isWideLayout}
          base16Theme={base16Theme}
          styling={styling}
          invertTheme={invertTheme}
        />
      </>
    );
  }
}
