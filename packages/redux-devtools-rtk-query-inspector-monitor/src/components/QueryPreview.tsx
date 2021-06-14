import React, { ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer } from '../styles/tree';
import {
  QueryPreviewTabOption,
  QueryPreviewTabs,
  QueryPreviewTabProps,
} from '../types';
import { QueryPreviewHeader } from './QueryPreviewHeader';
import { QueryPreviewInfo } from './QueryPreviewInfo';
import { QueryPreviewApiConfig } from './QueryPreviewApiConfig';
import { QueryPreviewSubscriptions } from './QueryPreviewSubscriptions';
import { QueryPreviewTags } from './QueryPreviewTags';

export interface QueryPreviewProps
  extends Omit<QueryPreviewTabProps, 'base16Theme' | 'invertTheme'> {
  selectedTab: QueryPreviewTabs;
  onTabChange: (tab: QueryPreviewTabs) => void;
}

const tabs: ReadonlyArray<QueryPreviewTabOption> = [
  {
    label: 'query',
    value: QueryPreviewTabs.queryinfo,
    component: QueryPreviewInfo,
  },
  {
    label: 'tags',
    value: QueryPreviewTabs.queryTags,
    component: QueryPreviewTags,
  },
  {
    label: 'subs',
    value: QueryPreviewTabs.querySubscriptions,
    component: QueryPreviewSubscriptions,
  },
  {
    label: 'api',
    value: QueryPreviewTabs.apiConfig,
    component: QueryPreviewApiConfig,
  },
];

export class QueryPreview extends React.PureComponent<QueryPreviewProps> {
  readonly labelRenderer: ReturnType<typeof createTreeItemLabelRenderer>;

  constructor(props: QueryPreviewProps) {
    super(props);

    this.labelRenderer = createTreeItemLabelRenderer(this.props.styling);
  }

  render(): ReactNode {
    const {
      queryInfo,
      isWideLayout,
      selectedTab,
      apiConfig,
      onTabChange,
      querySubscriptions,
      tags,
    } = this.props;

    const { component: TabComponent } =
      tabs.find((tab) => tab.value === selectedTab) || tabs[0];

    if (!queryInfo) {
      return (
        <StyleUtilsContext.Consumer>
          {({ styling }) => (
            <div {...styling('queryPreview')}>
              <QueryPreviewHeader
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                tabs={tabs}
              />
            </div>
          )}
        </StyleUtilsContext.Consumer>
      );
    }

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, base16Theme, invertTheme }) => {
          return (
            <div {...styling('queryPreview')}>
              <QueryPreviewHeader
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                tabs={tabs}
              />
              <TabComponent
                styling={styling}
                base16Theme={base16Theme}
                invertTheme={invertTheme}
                querySubscriptions={querySubscriptions}
                queryInfo={queryInfo}
                tags={tags}
                apiConfig={apiConfig}
                isWideLayout={isWideLayout}
              />
            </div>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
