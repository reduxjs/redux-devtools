import React, { ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { QueryPreviewTabs, TabOption } from '../types';
import { emptyArray } from '../utils/object';

export interface QueryPreviewHeaderProps {
  tabs: ReadonlyArray<
    TabOption<QueryPreviewTabs, unknown, 'query' | 'mutation'>
  >;
  onTabChange: (tab: QueryPreviewTabs) => void;
  selectedTab: QueryPreviewTabs;
  renderTabLabel?: (tab: QueryPreviewHeaderProps['tabs'][number]) => ReactNode;
}

export class QueryPreviewHeader extends React.Component<QueryPreviewHeaderProps> {
  handleTabClick = (tab: QueryPreviewHeaderProps['tabs'][number]): void => {
    if (this.props.selectedTab !== tab.value) {
      this.props.onTabChange(tab.value);
    }
  };

  render(): ReactNode {
    const { tabs, selectedTab, renderTabLabel } = this.props;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling }) => (
          <div {...styling('previewHeader')}>
            <div {...styling('tabSelector')}>
              {tabs.map((tab) => (
                <div
                  onClick={() => this.handleTabClick(tab)}
                  key={tab.value}
                  {...styling(
                    [
                      'selectorButton',
                      tab.value === selectedTab && 'selectorButtonSelected',
                    ],
                    tab.value === selectedTab
                  )}
                >
                  <span>
                    {renderTabLabel ? renderTabLabel(tab) : tab.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </StyleUtilsContext.Consumer>
    );
  }

  static defaultProps = {
    tabs: emptyArray,
  };
}
