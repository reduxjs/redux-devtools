import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabs, RtkQueryTag } from '../types';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y';
import { TreeView, TreeViewProps } from './TreeView';

interface QueryPreviewTagsState {
  data: { tags: RtkQueryTag[] };
}

const rootProps: TreeViewProps['rootProps'] = {
  'aria-labelledby': renderTabPanelButtonId(QueryPreviewTabs.queryTags),
  id: renderTabPanelId(QueryPreviewTabs.queryTags),
  role: 'tabpanel',
};

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

    return (
      <TreeView rootProps={rootProps} data={tags} isWideLayout={isWideLayout} />
    );
  }
}
