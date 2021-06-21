import React, { ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { QueryPreviewTabOption, QueryPreviewTabs } from '../types';
import { emptyArray } from '../utils/object';

export interface QueryPreviewHeaderProps {
  tabs: ReadonlyArray<QueryPreviewTabOption>;
  onTabChange: (tab: QueryPreviewTabs) => void;
  selectedTab: QueryPreviewTabs;
  renderTabLabel?: (tab: QueryPreviewTabOption) => ReactNode;
}

export class QueryPreviewHeader extends React.Component<QueryPreviewHeaderProps> {
  handleTabClick = (tab: QueryPreviewTabOption): void => {
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
                  {renderTabLabel ? renderTabLabel(tab) : tab.label}
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
