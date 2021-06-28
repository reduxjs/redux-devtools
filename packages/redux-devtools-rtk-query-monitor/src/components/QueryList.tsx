import React, { PureComponent, ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { QueryInfo, RtkQueryMonitorState } from '../types';
import { isQuerySelected } from '../utils/rtk-query';

export interface QueryListProps {
  queryInfos: QueryInfo[];
  selectedQueryKey: RtkQueryMonitorState['selectedQueryKey'];
  onSelectQuery: (query: QueryInfo) => void;
}

export class QueryList extends PureComponent<QueryListProps> {
  static isItemSelected(
    selectedQueryKey: QueryListProps['selectedQueryKey'],
    queryInfo: QueryInfo
  ): boolean {
    return (
      !!selectedQueryKey &&
      selectedQueryKey.queryKey === queryInfo.queryKey &&
      selectedQueryKey.reducerPath === queryInfo.reducerPath
    );
  }

  render(): ReactNode {
    const { queryInfos, selectedQueryKey, onSelectQuery } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling }) => (
          <ul {...styling('queryList')}>
            {queryInfos.map((queryInfo) => {
              const isSelected = isQuerySelected(selectedQueryKey, queryInfo);

              return (
                <li
                  key={queryInfo.queryKey}
                  onClick={() => onSelectQuery(queryInfo)}
                  {...styling(
                    ['queryListItem', isSelected && 'queryListItemSelected'],
                    isSelected
                  )}
                >
                  <p {...styling('queryListItemKey')}>{queryInfo.queryKey}</p>
                  <p {...styling('queryStatus')}>{queryInfo.query.status}</p>
                </li>
              );
            })}
          </ul>
        )}
      </StyleUtilsContext.Consumer>
    );
  }
}
