import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabProps } from '../types';
import { TreeView } from './TreeView';

interface QueryPreviewTagsState {
  data: { tags: QueryPreviewTabProps['tags'] };
}

export class QueryPreviewTags extends PureComponent<
  QueryPreviewTabProps,
  QueryPreviewTagsState
> {
  static getDerivedStateFromProps(
    { tags }: QueryPreviewTabProps,
    state: QueryPreviewTagsState
  ): QueryPreviewTagsState | null {
    if (tags !== state.data.tags) {
      return {
        data: { tags },
      };
    }

    return null;
  }

  constructor(props: QueryPreviewTabProps) {
    super(props);

    this.state = {
      data: { tags: props.tags },
    };
  }

  render(): ReactNode {
    const { queryInfo, isWideLayout, base16Theme, styling, invertTheme } =
      this.props;

    if (!queryInfo) {
      return null;
    }

    return (
      <TreeView
        data={this.state.data}
        isWideLayout={isWideLayout}
        base16Theme={base16Theme}
        styling={styling}
        invertTheme={invertTheme}
      />
    );
  }
}
