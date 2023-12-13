import React, { ReactNode, PureComponent } from 'react';
import type { ShouldExpandNodeInitially } from 'react-json-tree';
import { ApiStats, QueryPreviewTabs, RtkQueryApiState } from '../types';
import { TreeView, TreeViewProps } from './TreeView';
import { renderTabPanelId, renderTabPanelButtonId } from '../utils/a11y';

export interface QueryPreviewApiProps {
  apiStats: ApiStats | null;
  apiState: RtkQueryApiState | null;
  isWideLayout: boolean;
}

const rootProps: TreeViewProps['rootProps'] = {
  'aria-labelledby': renderTabPanelButtonId(QueryPreviewTabs.apiConfig),
  id: renderTabPanelId(QueryPreviewTabs.apiConfig),
  role: 'tabpanel',
};

export class QueryPreviewApi extends PureComponent<QueryPreviewApiProps> {
  shouldExpandApiStateNode: ShouldExpandNodeInitially = (
    keyPath,
    value,
    layer,
  ) => {
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
      <article
        {...rootProps}
        css={(theme) => ({
          display: 'block',
          overflowY: 'auto',
          padding: '0.5em 0',
          color: theme.TAB_CONTENT_COLOR,
          '& h2': {
            color: theme.ULIST_STRONG_COLOR,
            padding: '0.5em 1em',
            fontWeight: 700,
          },
          '& h3': {
            color: theme.ULIST_STRONG_COLOR,
          },
        })}
      >
        <h2>{apiState.config.reducerPath}</h2>
        <TreeView
          before={<h3>State</h3>}
          data={apiState}
          shouldExpandNodeInitially={this.shouldExpandApiStateNode}
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
    );
  }
}
