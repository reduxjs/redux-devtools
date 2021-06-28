import React, { ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer } from '../styles/tree';
import {
  QueryPreviewTabs,
  QueryInfo,
  SelectorsSource,
  TabOption,
} from '../types';
import { QueryPreviewHeader } from '../components/QueryPreviewHeader';
import {
  QueryPreviewInfo,
  QueryPreviewInfoProps,
} from '../components/QueryPreviewInfo';
import {
  QueryPreviewApi,
  QueryPreviewApiProps,
} from '../components/QueryPreviewApi';
import {
  QueryPreviewSubscriptions,
  QueryPreviewSubscriptionsProps,
} from '../components/QueryPreviewSubscriptions';
import {
  QueryPreviewTags,
  QueryPreviewTagsProps,
} from '../components/QueryPreviewTags';
import { NoRtkQueryApi } from '../components/NoRtkQueryApi';
import { InspectorSelectors } from '../selectors';
import { StylingFunction } from 'react-base16-styling';
import { mapProps } from './mapProps';
import {
  QueryPreviewActions,
  QueryPreviewActionsProps,
} from '../components/QueryPreviewActions';

export interface QueryPreviewProps<S = unknown> {
  readonly selectedTab: QueryPreviewTabs;
  readonly hasNoApis: boolean;
  readonly onTabChange: (tab: QueryPreviewTabs) => void;
  readonly queryInfo: QueryInfo | null;
  readonly styling: StylingFunction;
  readonly isWideLayout: boolean;
  readonly selectorsSource: SelectorsSource<S>;
  readonly selectors: InspectorSelectors<S>;
}

/**
 * Tab content is not rendered if there's no selected query.
 */
type QueryPreviewTabProps = Omit<QueryPreviewProps<unknown>, 'queryInfo'> & {
  queryInfo: QueryInfo;
};

const MappedQueryPreviewTags = mapProps<
  QueryPreviewTabProps,
  QueryPreviewTagsProps
>(({ selectors, selectorsSource, isWideLayout, queryInfo }) => ({
  queryInfo,
  tags: selectors.selectCurrentQueryTags(selectorsSource),
  isWideLayout,
}))(QueryPreviewTags);

const MappedQueryPreviewInfo = mapProps<
  QueryPreviewTabProps,
  QueryPreviewInfoProps
>(({ queryInfo, isWideLayout }) => ({ queryInfo, isWideLayout }))(
  QueryPreviewInfo
);

const MappedQuerySubscriptipns = mapProps<
  QueryPreviewTabProps,
  QueryPreviewSubscriptionsProps
>(({ selectors, selectorsSource, isWideLayout }) => ({
  isWideLayout,
  subscriptions: selectors.selectSubscriptionsOfCurrentQuery(selectorsSource),
}))(QueryPreviewSubscriptions);

const MappedApiPreview = mapProps<QueryPreviewTabProps, QueryPreviewApiProps>(
  ({ isWideLayout, selectors, selectorsSource }) => ({
    isWideLayout,
    apiState: selectors.selectApiOfCurrentQuery(selectorsSource),
    apiStats: selectors.selectApiStatsOfCurrentQuery(selectorsSource),
  })
)(QueryPreviewApi);

const MappedQueryPreviewActions = mapProps<
  QueryPreviewTabProps,
  QueryPreviewActionsProps
>(({ isWideLayout, selectorsSource, selectors }) => ({
  isWideLayout,
  actionsOfQuery: selectors.selectActionsOfCurrentQuery(selectorsSource),
}))(QueryPreviewActions);

const tabs: ReadonlyArray<TabOption<QueryPreviewTabs, QueryPreviewTabProps>> = [
  {
    label: 'query',
    value: QueryPreviewTabs.queryinfo,
    component: MappedQueryPreviewInfo,
  },
  {
    label: 'actions',
    value: QueryPreviewTabs.actions,
    component: MappedQueryPreviewActions,
  },
  {
    label: 'tags',
    value: QueryPreviewTabs.queryTags,
    component: MappedQueryPreviewTags,
  },
  {
    label: 'subs',
    value: QueryPreviewTabs.querySubscriptions,
    component: MappedQuerySubscriptipns,
  },
  {
    label: 'api',
    value: QueryPreviewTabs.apiConfig,
    component: MappedApiPreview,
  },
];

export class QueryPreview<S> extends React.PureComponent<QueryPreviewProps<S>> {
  readonly labelRenderer: ReturnType<typeof createTreeItemLabelRenderer>;

  constructor(props: QueryPreviewProps<S>) {
    super(props);

    this.labelRenderer = createTreeItemLabelRenderer(this.props.styling);
  }

  renderLabelWithCounter = (
    label: React.ReactText,
    counter: number
  ): string => {
    let counterAsString = counter.toFixed(0);

    if (counterAsString.length > 3) {
      counterAsString = counterAsString.slice(0, 2) + '...';
    }

    return `${label}(${counterAsString})`;
  };

  renderTabLabel = (tab: TabOption<QueryPreviewTabs, unknown>): ReactNode => {
    const { selectors, selectorsSource } = this.props;
    const tabCount = selectors.selectTabCounters(selectorsSource)[tab.value];

    if (tabCount > 0) {
      return this.renderLabelWithCounter(tab.label, tabCount);
    }

    return tab.label;
  };

  render(): ReactNode {
    const { queryInfo, selectedTab, onTabChange, hasNoApis } = this.props;

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
                tabs={
                  tabs as ReadonlyArray<TabOption<QueryPreviewTabs, unknown>>
                }
                renderTabLabel={this.renderTabLabel}
              />
              {hasNoApis && <NoRtkQueryApi />}
            </div>
          )}
        </StyleUtilsContext.Consumer>
      );
    }

    return (
      <StyleUtilsContext.Consumer>
        {({ styling }) => {
          return (
            <div {...styling('queryPreview')}>
              <QueryPreviewHeader
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                tabs={
                  tabs as ReadonlyArray<TabOption<QueryPreviewTabs, unknown>>
                }
                renderTabLabel={this.renderTabLabel}
              />
              <TabComponent {...(this.props as QueryPreviewTabProps)} />
            </div>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
