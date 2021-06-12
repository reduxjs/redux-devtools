import React, { ReactNode } from 'react';
import JSONTree from 'react-json-tree';
import { StylingFunction } from 'react-base16-styling';
import { DATA_TYPE_KEY } from '../monitor-config';
import {
  getJsonTreeTheme,
  StyleUtilsContext,
} from '../styles/createStylingFromTheme';
import { createTreeItemLabelRenderer, getItemString } from '../styles/tree';
import { QueryInfo } from '../types';

export interface QueryPreviewProps {
  selectedQueryInfo: QueryInfo | null;
  styling: StylingFunction;
  isWideLayout: boolean;
}

export class QueryPreview extends React.PureComponent<QueryPreviewProps> {
  readonly labelRenderer: ReturnType<typeof createTreeItemLabelRenderer>;

  constructor(props: QueryPreviewProps) {
    super(props);

    this.labelRenderer = createTreeItemLabelRenderer(this.props.styling);
  }

  render(): ReactNode {
    const { selectedQueryInfo, isWideLayout } = this.props;

    if (!selectedQueryInfo) {
      return (
        <StyleUtilsContext.Consumer>
          {({ styling }) => <div {...styling('queryPreview')} />}
        </StyleUtilsContext.Consumer>
      );
    }

    const {
      query: {
        endpointName,
        fulfilledTimeStamp,
        status,
        startedTimeStamp,
        data,
      },
      reducerPath,
    } = selectedQueryInfo;

    const startedAt = startedTimeStamp
      ? new Date(startedTimeStamp).toISOString()
      : '-';

    const latestFetch = fulfilledTimeStamp
      ? new Date(fulfilledTimeStamp).toISOString()
      : '-';

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, base16Theme, invertTheme }) => {
          return (
            <div {...styling('queryPreview')}>
              <React.Fragment>
                <div {...styling('previewHeader')}></div>
                <ul>
                  <li>{`reducerPath: ${reducerPath ?? '-'}`}</li>
                  <li>{`endpointName: ${endpointName ?? '-'}`}</li>
                  <li>{`status: ${status}`}</li>
                  <li>{`loaded at: ${latestFetch}`}</li>
                  <li>{`requested at: ${startedAt}`}</li>
                </ul>
                <div style={{ padding: '1em' }}>
                  <JSONTree
                    data={data}
                    labelRenderer={this.labelRenderer}
                    theme={getJsonTreeTheme(base16Theme)}
                    invertTheme={invertTheme}
                    getItemString={(type, data) =>
                      getItemString(
                        styling,
                        type,
                        data,
                        DATA_TYPE_KEY,
                        isWideLayout
                      )
                    }
                    hideRoot
                  />
                </div>
              </React.Fragment>
            </div>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
