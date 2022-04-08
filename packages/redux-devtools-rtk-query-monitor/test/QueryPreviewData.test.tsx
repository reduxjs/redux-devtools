import React from 'react';
import { render, screen } from '@testing-library/react';
import QueryPreviewData from '../src/components/QueryPreviewData';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { RtkResourceInfo } from '../src/types';

test('Data tab shows data when request succeeded', () => {
  render(
    <QueryPreviewData
      resInfo={
        {
          state: {
            status: QueryStatus.fulfilled,
            data: {
              id: 1,
              name: 'behzad',
            },
          },
        } as RtkResourceInfo
      }
      isWideLayout={false}
    />
  );

  expect(screen.queryByText('status')).toBeInTheDocument();
  expect(screen.queryByText('data')).toBeInTheDocument();
  expect(screen.queryByText('error')).not.toBeInTheDocument();
});

test('Data tab shows error when request failed', () => {
  render(
    <QueryPreviewData
      resInfo={
        {
          state: {
            status: QueryStatus.rejected,
            error: {
              message: 'oh no :(',
            },
          },
        } as RtkResourceInfo
      }
      isWideLayout={false}
    />
  );

  expect(screen.queryByText('status')).toBeInTheDocument();
  expect(screen.queryByText('error')).toBeInTheDocument();
  expect(screen.queryByText('data')).not.toBeInTheDocument();
});

test('Data tab shows status when request is not done yet', () => {
  render(
    <QueryPreviewData
      resInfo={
        {
          state: {
            status: QueryStatus.pending,
            data: undefined,
            error: undefined,
          },
        } as RtkResourceInfo
      }
      isWideLayout={false}
    />
  );

  expect(screen.queryByText('status')).toBeInTheDocument();
  expect(screen.queryByText('error')).not.toBeInTheDocument();
  expect(screen.queryByText('data')).not.toBeInTheDocument();
});
