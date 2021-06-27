import { createSelector, Selector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import React, { ReactNode, PureComponent } from 'react';
import { QueryInfo, RtkQueryState, RTKStatusFlags } from '../types';
import { formatMs } from '../utils/formatters';
import { identity } from '../utils/object';
import { getQueryStatusFlags } from '../utils/rtk-query';
import { TreeView } from './TreeView';

type QueryTimings = {
  startedAt: string;
  loadedAt: string;
  duration: string;
};

interface FormattedQuery {
  queryKey: string;
  reducerPath: string;
  timings: QueryTimings;
  statusFlags: RTKStatusFlags;
  query: RtkQueryState;
}

export interface QueryPreviewInfoProps {
  queryInfo: QueryInfo;
  isWideLayout: boolean;
}
export class QueryPreviewInfo extends PureComponent<QueryPreviewInfoProps> {
  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    const lastKey = keyPath[keyPath.length - 1];

    return layer <= 1 && lastKey !== 'query';
  };

  selectFormattedQuery: Selector<QueryInfo, FormattedQuery> = createSelector(
    identity,
    (queryInfo: QueryInfo): FormattedQuery => {
      const { query, queryKey, reducerPath } = queryInfo;

      const startedAt = query.startedTimeStamp
        ? new Date(query.startedTimeStamp).toISOString()
        : '-';

      const loadedAt = query.fulfilledTimeStamp
        ? new Date(query.fulfilledTimeStamp).toISOString()
        : '-';

      const statusFlags = getQueryStatusFlags(query);

      const timings = {
        startedAt,
        loadedAt,
        duration: '-',
      };

      if (
        query.fulfilledTimeStamp &&
        query.startedTimeStamp &&
        query.status !== QueryStatus.pending &&
        query.startedTimeStamp <= query.fulfilledTimeStamp
      ) {
        timings.duration = formatMs(
          query.fulfilledTimeStamp - query.startedTimeStamp
        );
      }

      return {
        queryKey,
        reducerPath,
        query: queryInfo.query,
        statusFlags,
        timings,
      };
    }
  );

  render(): ReactNode {
    const { queryInfo, isWideLayout } = this.props;
    const formattedQuery = this.selectFormattedQuery(queryInfo);

    return (
      <TreeView
        data={formattedQuery}
        isWideLayout={isWideLayout}
        shouldExpandNode={this.shouldExpandNode}
      />
    );
  }
}
