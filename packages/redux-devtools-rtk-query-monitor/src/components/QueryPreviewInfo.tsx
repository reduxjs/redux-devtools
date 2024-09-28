import { createSelector, Selector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import React, { ReactNode, PureComponent } from 'react';
import type { ShouldExpandNodeInitially } from 'react-json-tree';
import { QueryPreviewTabs, RtkResourceInfo, RTKStatusFlags } from '../types';
import { renderTabPanelButtonId, renderTabPanelId } from '../utils/a11y';
import { formatMs } from '../utils/formatters';
import { identity } from '../utils/object';
import { getQueryStatusFlags } from '../utils/rtk-query';
import { TreeView, TreeViewProps } from './TreeView';

type QueryTimings = {
  startedAt: string;
  loadedAt: string;
  duration: string;
};

type FormattedQuery = {
  key: string;
  reducerPath: string;
  timings: QueryTimings;
  statusFlags: RTKStatusFlags;
} & (
  | { mutation: RtkResourceInfo['state'] }
  | { query: RtkResourceInfo['state'] }
);

const rootProps: TreeViewProps['rootProps'] = {
  'aria-labelledby': renderTabPanelButtonId(QueryPreviewTabs.queryinfo),
  id: renderTabPanelId(QueryPreviewTabs.queryinfo),
  role: 'tabpanel',
};

export interface QueryPreviewInfoProps {
  resInfo: RtkResourceInfo;
  isWideLayout: boolean;
}
export class QueryPreviewInfo extends PureComponent<QueryPreviewInfoProps> {
  shouldExpandNodeInitially: ShouldExpandNodeInitially = (
    keyPath,
    value,
    layer,
  ) => {
    const lastKey = keyPath[keyPath.length - 1];

    return layer <= 1 && lastKey !== 'query' && lastKey !== 'mutation';
  };

  selectFormattedQuery: Selector<RtkResourceInfo, FormattedQuery> =
    createSelector<
      [(identity: RtkResourceInfo) => RtkResourceInfo],
      FormattedQuery
    >(identity, (resInfo: RtkResourceInfo): FormattedQuery => {
      const { state, queryKey, reducerPath } = resInfo;

      const startedAt = state.startedTimeStamp
        ? new Date(state.startedTimeStamp).toISOString()
        : '-';

      const loadedAt = state.fulfilledTimeStamp
        ? new Date(state.fulfilledTimeStamp).toISOString()
        : '-';

      const statusFlags = getQueryStatusFlags(state);

      const timings = {
        startedAt,
        loadedAt,
        duration: '-',
      };

      if (
        state.fulfilledTimeStamp &&
        state.startedTimeStamp &&
        state.status !== QueryStatus.pending &&
        state.startedTimeStamp <= state.fulfilledTimeStamp
      ) {
        timings.duration = formatMs(
          state.fulfilledTimeStamp - state.startedTimeStamp,
        );
      }

      if (resInfo.type === 'query') {
        return {
          key: queryKey,
          reducerPath,
          query: resInfo.state,
          statusFlags,
          timings,
        };
      }

      return {
        key: queryKey,
        reducerPath,
        mutation: resInfo.state,
        statusFlags,
        timings,
      };
    });

  render(): ReactNode {
    const { resInfo, isWideLayout } = this.props;
    const formattedQuery = this.selectFormattedQuery(resInfo);

    return (
      <TreeView
        rootProps={rootProps}
        data={formattedQuery}
        isWideLayout={isWideLayout}
        shouldExpandNodeInitially={this.shouldExpandNodeInitially}
      />
    );
  }
}
