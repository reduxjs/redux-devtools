import { createSelector, Selector } from '@reduxjs/toolkit';
import React, { ReactNode, PureComponent } from 'react';
import { QueryInfo, RtkQueryState, RTKStatusFlags } from '../types';
import { identity } from '../utils/object';
import { getQueryStatusFlags } from '../utils/rtk-query';
import { TreeView } from './TreeView';

type ComputedQueryInfo = {
  startedAt: string;
  latestFetchAt: string;
};

interface FormattedQuery extends ComputedQueryInfo {
  queryKey: string;
  reducerPath: string;
  statusFlags: RTKStatusFlags;
  query: RtkQueryState;
}

export interface QueryPreviewInfoProps {
  queryInfo: QueryInfo;
  isWideLayout: boolean;
}
export class QueryPreviewInfo extends PureComponent<QueryPreviewInfoProps> {
  selectFormattedQuery: Selector<QueryInfo, FormattedQuery> = createSelector(
    identity,
    (queryInfo: QueryInfo): FormattedQuery => {
      const { query, queryKey, reducerPath } = queryInfo;

      const startedAt = query.startedTimeStamp
        ? new Date(query.startedTimeStamp).toISOString()
        : '-';

      const latestFetchAt = query.fulfilledTimeStamp
        ? new Date(query.fulfilledTimeStamp).toISOString()
        : '-';

      const statusFlags = getQueryStatusFlags(query);

      return {
        queryKey,
        reducerPath,
        startedAt,
        latestFetchAt,
        statusFlags,
        query: queryInfo.query,
      };
    }
  );

  render(): ReactNode {
    const { queryInfo, isWideLayout } = this.props;
    const formattedQuery = this.selectFormattedQuery(queryInfo);

    return <TreeView data={formattedQuery} isWideLayout={isWideLayout} />;
  }
}
