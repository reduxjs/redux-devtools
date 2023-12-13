import React, { PureComponent, ReactNode } from 'react';
import type { Interpolation, Theme } from '@emotion/react';
import { RtkResourceInfo, RtkQueryMonitorState } from '../types';
import { isQuerySelected } from '../utils/rtk-query';

const queryStatusCss: Interpolation<Theme> = (theme) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 22,
  padding: '0 6px',
  borderRadius: '3px',
  fontSize: '0.7em',
  lineHeight: '1em',
  flexShrink: 0,
  fontWeight: 700,
  backgroundColor: theme.ACTION_TIME_BACK_COLOR,
  color: theme.ACTION_TIME_COLOR,
});

export interface QueryListProps {
  resInfos: RtkResourceInfo[];
  selectedQueryKey: RtkQueryMonitorState['selectedQueryKey'];
  onSelectQuery: (query: RtkResourceInfo) => void;
}

export class QueryList extends PureComponent<QueryListProps> {
  static isItemSelected(
    selectedQueryKey: QueryListProps['selectedQueryKey'],
    queryInfo: RtkResourceInfo,
  ): boolean {
    return (
      !!selectedQueryKey &&
      selectedQueryKey.queryKey === queryInfo.queryKey &&
      selectedQueryKey.reducerPath === queryInfo.reducerPath
    );
  }

  static formatQuery(resInfo: RtkResourceInfo): string {
    const key =
      resInfo.type === 'query'
        ? resInfo.queryKey
        : `${resInfo.state.endpointName ?? ''} ${resInfo.queryKey}`;

    return key;
  }

  render(): ReactNode {
    const { resInfos, selectedQueryKey, onSelectQuery } = this.props;

    return (
      <ul css={{ listStyle: 'none', margin: '0', padding: '0' }}>
        {resInfos.map((resInfo) => {
          const isSelected = isQuerySelected(selectedQueryKey, resInfo);

          return (
            <li
              key={resInfo.queryKey}
              onClick={() => onSelectQuery(resInfo)}
              css={[
                (theme) => ({
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  '&:last-child': {
                    borderBottomWidth: 0,
                  },
                  overflow: 'hidden',
                  maxHeight: 47,
                  borderBottomColor: theme.BORDER_COLOR,
                }),
                isSelected &&
                  ((theme) => ({
                    backgroundColor: theme.SELECTED_BACKGROUND_COLOR,
                  })),
              ]}
            >
              <p
                css={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: 'calc(100% - 70px)',
                  wordBreak: 'break-all',
                  margin: 0,
                }}
              >
                {QueryList.formatQuery(resInfo)}
              </p>
              <div
                css={{
                  display: 'flex',
                  width: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 0,
                  flex: '0 0 auto',
                  overflow: 'hidden',
                }}
              >
                <strong css={[queryStatusCss, { marginRight: 4 }]}>
                  {resInfo.type === 'query' ? 'Q' : 'M'}
                </strong>
                <p css={queryStatusCss}>{resInfo.state.status}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
