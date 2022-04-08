import React from 'react';
import { createSelector, Selector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { RtkResourceInfo } from '../types';
import { TreeView } from './TreeView';
import { identity } from '../utils/object';

type FormattedQuery =
  | { status: QueryStatus.fulfilled; data: unknown }
  | {
      status: QueryStatus.rejected;
      error: unknown;
    }
  | {
      status: QueryStatus.uninitialized | QueryStatus.pending;
    };

const selectFormattedQuery: Selector<RtkResourceInfo, FormattedQuery> =
  createSelector<
    [(identity: RtkResourceInfo) => RtkResourceInfo],
    FormattedQuery
  >(identity, ({ state }: RtkResourceInfo): FormattedQuery => {
    if (state.status === 'fulfilled') {
      return {
        status: state.status,
        data: state.data,
      };
    }

    if (state.status === 'rejected') {
      return {
        status: state.status,
        error: state.error,
      };
    }

    return {
      status: state.status,
    };
  });

export interface QueryPreviewDataProps {
  resInfo: RtkResourceInfo;
  isWideLayout: boolean;
}

function QueryPreviewData({ resInfo, isWideLayout }: QueryPreviewDataProps) {
  const formattedQuery = selectFormattedQuery(resInfo);

  return <TreeView data={formattedQuery} isWideLayout={isWideLayout} />;
}

export default QueryPreviewData;
