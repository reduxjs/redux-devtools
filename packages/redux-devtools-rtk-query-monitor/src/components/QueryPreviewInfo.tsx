import { createSelector, Selector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import React, { ReactNode, PureComponent } from 'react';
import { RtkResourceInfo, RTKStatusFlags } from '../types';
import { formatMs } from '../utils/formatters';
import { identity } from '../utils/object';
import { getQueryStatusFlags } from '../utils/rtk-query';
import { TreeView } from './TreeView';

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

export interface QueryPreviewInfoProps {
  resInfo: RtkResourceInfo;
  isWideLayout: boolean;
}
export class QueryPreviewInfo extends PureComponent<QueryPreviewInfoProps> {
  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    const lastKey = keyPath[keyPath.length - 1];

    return layer <= 1 && lastKey !== 'query' && lastKey !== 'mutation';
  };

  selectFormattedQuery: Selector<RtkResourceInfo, FormattedQuery> =
    createSelector(identity, (resInfo: RtkResourceInfo): FormattedQuery => {
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
          state.fulfilledTimeStamp - state.startedTimeStamp
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
        data={formattedQuery}
        isWideLayout={isWideLayout}
        shouldExpandNode={this.shouldExpandNode}
      />
    );
  }
}
