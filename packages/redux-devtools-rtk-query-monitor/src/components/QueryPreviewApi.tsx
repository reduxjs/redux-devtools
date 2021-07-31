import React, { ReactNode, PureComponent } from 'react';
import { ApiStats, RtkQueryApiState } from '../types';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { TreeView } from './TreeView';

export interface QueryPreviewApiProps {
  apiStats: ApiStats | null;
  apiState: RtkQueryApiState | null;
  isWideLayout: boolean;
}

export class QueryPreviewApi extends PureComponent<QueryPreviewApiProps> {
  shouldExpandApiStateNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    const lastKey = keyPath[keyPath.length - 1];

    return layer <= 1 && lastKey !== 'config';
  };

  render(): ReactNode {
    const { apiStats, isWideLayout, apiState } = this.props;

    if (!apiState) {
      return null;
    }

    const hasMutations = Object.keys(apiState.mutations).length > 0;
    const hasQueries = Object.keys(apiState.queries).length > 0;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling }) => (
          <article {...styling('tabContent')}>
            <h2>{apiState.config.reducerPath}</h2>
            <TreeView
              before={<h3>State</h3>}
              data={apiState}
              shouldExpandNode={this.shouldExpandApiStateNode}
              isWideLayout={isWideLayout}
            />
            {apiStats && (
              <>
                <TreeView
                  before={<h3>Tally</h3>}
                  data={apiStats.tally}
                  isWideLayout={isWideLayout}
                />
                {hasQueries && (
                  <TreeView
                    before={<h3>Queries Timings</h3>}
                    data={apiStats.timings.queries}
                    isWideLayout={isWideLayout}
                  />
                )}
                {hasMutations && (
                  <TreeView
                    before={<h3>Mutations Timings</h3>}
                    data={apiStats.timings.mutations}
                    isWideLayout={isWideLayout}
                  />
                )}
              </>
            )}
          </article>
        )}
      </StyleUtilsContext.Consumer>
    );
  }
}
