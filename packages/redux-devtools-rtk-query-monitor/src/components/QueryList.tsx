import React, { PureComponent, ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { RtkResourceInfo, RtkQueryMonitorState } from '../types';
import { isQuerySelected } from '../utils/rtk-query';

export interface QueryListProps {
  resInfos: RtkResourceInfo[];
  selectedQueryKey: RtkQueryMonitorState['selectedQueryKey'];
  onSelectQuery: (query: RtkResourceInfo) => void;
}

export class QueryList extends PureComponent<QueryListProps> {
  static isItemSelected(
    selectedQueryKey: QueryListProps['selectedQueryKey'],
    queryInfo: RtkResourceInfo
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
      <StyleUtilsContext.Consumer>
        {({ styling }) => (
          <ul {...styling('queryList')}>
            {resInfos.map((resInfo) => {
              const isSelected = isQuerySelected(selectedQueryKey, resInfo);

              return (
                <li
                  key={resInfo.queryKey}
                  onClick={() => onSelectQuery(resInfo)}
                  {...styling(
                    ['queryListItem', isSelected && 'queryListItemSelected'],
                    isSelected
                  )}
                >
                  <p {...styling('queryListItemKey')}>
                    {QueryList.formatQuery(resInfo)}
                  </p>
                  <div {...styling('queryStatusWrapper')}>
                    <strong {...styling(['queryStatus', 'queryType'])}>
                      {resInfo.type === 'query' ? 'Q' : 'M'}
                    </strong>
                    <p {...styling('queryStatus')}>{resInfo.state.status}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StyleUtilsContext.Consumer>
    );
  }
}
