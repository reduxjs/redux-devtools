import React, { ReactNode, PureComponent } from 'react';
import { RtkQueryTag } from '../types';
import { TreeView } from './TreeView';

interface QueryPreviewTagsState {
  data: { tags: RtkQueryTag[] };
}

export interface QueryPreviewTagsProps {
  tags: RtkQueryTag[];
  isWideLayout: boolean;
}

export class QueryPreviewTags extends PureComponent<
  QueryPreviewTagsProps,
  QueryPreviewTagsState
> {
  constructor(props: QueryPreviewTagsProps) {
    super(props);

    this.state = {
      data: { tags: props.tags },
    };
  }

  render(): ReactNode {
    const { isWideLayout, tags } = this.props;

    return <TreeView data={tags} isWideLayout={isWideLayout} />;
  }
}
