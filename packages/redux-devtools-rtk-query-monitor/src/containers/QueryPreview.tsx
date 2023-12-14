import React, { ReactNode } from 'react';
import type { Interpolation, Theme } from '@emotion/react';
import {
  QueryPreviewTabs,
  RtkResourceInfo,
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
import { mapProps } from './mapProps';
import {
  QueryPreviewActions,
  QueryPreviewActionsProps,
} from '../components/QueryPreviewActions';
import { isTabVisible } from '../utils/tabs';
import {
  QueryPreviewData,
  QueryPreviewDataProps,
} from '../components/QueryPreviewData';

const queryPreviewCss: Interpolation<Theme> = (theme) => ({
  flex: '1 1 50%',
  overflowX: 'hidden',
  oveflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'hidden',
  '& pre': {
    border: 'inherit',
    borderRadius: '3px',
    lineHeight: 'inherit',
    color: 'inherit',
  },

  backgroundColor: theme.BACKGROUND_COLOR,
});

export interface QueryPreviewProps<S = unknown> {
  readonly selectedTab: QueryPreviewTabs;
  readonly hasNoApis: boolean;
  readonly onTabChange: (tab: QueryPreviewTabs) => void;
  readonly resInfo: RtkResourceInfo | null;
  readonly isWideLayout: boolean;
  readonly selectorsSource: SelectorsSource<S>;
  readonly selectors: InspectorSelectors<S>;
}

/**
 * Tab content is not rendered if there's no selected query.
 */
type QueryPreviewTabProps = Omit<QueryPreviewProps<unknown>, 'resInfo'> & {
  resInfo: RtkResourceInfo;
};

const MappedQueryPreviewTags = mapProps<
  QueryPreviewTabProps,
  QueryPreviewTagsProps
>(({ selectors, selectorsSource, isWideLayout, resInfo }) => ({
  resInfo,
  tags: selectors.selectCurrentQueryTags(selectorsSource),
  isWideLayout,
}))(QueryPreviewTags);

const MappedQueryPreviewInfo = mapProps<
  QueryPreviewTabProps,
  QueryPreviewInfoProps
>(({ resInfo, isWideLayout }) => ({ resInfo, isWideLayout }))(QueryPreviewInfo);

const MappedQueryPreviewData = mapProps<
  QueryPreviewTabProps,
  QueryPreviewDataProps
>(({ resInfo, isWideLayout }) => ({
  data: resInfo?.state?.data,
  isWideLayout,
}))(QueryPreviewData);

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
  }),
)(QueryPreviewApi);

const MappedQueryPreviewActions = mapProps<
  QueryPreviewTabProps,
  QueryPreviewActionsProps
>(({ isWideLayout, selectorsSource, selectors }) => ({
  isWideLayout,
  actionsOfQuery: selectors.selectActionsOfCurrentQuery(selectorsSource),
}))(QueryPreviewActions);

const tabs: ReadonlyArray<
  TabOption<QueryPreviewTabs, QueryPreviewTabProps, RtkResourceInfo['type']>
> = [
  {
    label: 'Data',
    value: QueryPreviewTabs.data,
    component: MappedQueryPreviewData,
    visible: {
      query: true,
      mutation: true,
      default: true,
    },
  },
  {
    label: 'Query',
    value: QueryPreviewTabs.queryinfo,
    component: MappedQueryPreviewInfo,
    visible: {
      query: true,
      mutation: true,
      default: true,
    },
  },
  {
    label: 'Actions',
    value: QueryPreviewTabs.actions,
    component: MappedQueryPreviewActions,
    visible: {
      query: true,
      mutation: true,
      default: true,
    },
  },
  {
    label: 'Tags',
    value: QueryPreviewTabs.queryTags,
    component: MappedQueryPreviewTags,
    visible: {
      query: true,
      mutation: false,
      default: true,
    },
  },
  {
    label: 'Subs',
    value: QueryPreviewTabs.querySubscriptions,
    component: MappedQuerySubscriptipns,
    visible: {
      query: true,
      mutation: false,
      default: true,
    },
  },
  {
    label: 'Api',
    value: QueryPreviewTabs.apiConfig,
    component: MappedApiPreview,
  },
];

export class QueryPreview<S> extends React.PureComponent<QueryPreviewProps<S>> {
  renderLabelWithCounter = (
    label: React.ReactText,
    counter: number,
  ): string => {
    let counterAsString = counter.toFixed(0);

    if (counterAsString.length > 3) {
      counterAsString = counterAsString.slice(0, 2) + '...';
    }

    return `${label}(${counterAsString})`;
  };

  renderTabLabel = (
    tab: TabOption<QueryPreviewTabs, unknown, 'query' | 'mutation'>,
  ): ReactNode => {
    const { selectors, selectorsSource, resInfo } = this.props;
    const tabCount = selectors.selectTabCounters(selectorsSource)[tab.value];

    let tabLabel = tab.label;

    if (tabLabel === 'query' && resInfo?.type === 'mutation') {
      tabLabel = resInfo.type;
    }

    if (tabCount > 0) {
      return this.renderLabelWithCounter(tabLabel, tabCount);
    }

    return tabLabel;
  };

  render(): ReactNode {
    const { resInfo, selectedTab, onTabChange, hasNoApis } = this.props;

    const { component: TabComponent } =
      tabs.find((tab) => tab.value === selectedTab) || tabs[0];

    if (!resInfo) {
      return (
        <div css={queryPreviewCss}>
          <QueryPreviewHeader
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            tabs={
              tabs.filter((tab) =>
                isTabVisible(tab, 'default'),
              ) as ReadonlyArray<
                TabOption<QueryPreviewTabs, unknown, RtkResourceInfo['type']>
              >
            }
            renderTabLabel={this.renderTabLabel}
          />
          {hasNoApis && <NoRtkQueryApi />}
        </div>
      );
    }

    return (
      <div css={queryPreviewCss}>
        <QueryPreviewHeader
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          tabs={
            tabs.filter((tab) =>
              isTabVisible(tab, resInfo.type),
            ) as ReadonlyArray<
              TabOption<QueryPreviewTabs, unknown, RtkResourceInfo['type']>
            >
          }
          renderTabLabel={this.renderTabLabel}
        />
        <TabComponent {...(this.props as QueryPreviewTabProps)} />
      </div>
    );
  }
}
