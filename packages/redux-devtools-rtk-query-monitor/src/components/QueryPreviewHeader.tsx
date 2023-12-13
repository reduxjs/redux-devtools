import React, { ReactNode } from 'react';
import { QueryPreviewTabs, TabOption } from '../types';
import { renderTabPanelButtonId } from '../utils/a11y';
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
      <div
        css={(theme) => ({
          flex: '0 0 30px',
          padding: '5px 4px',
          alignItems: 'center',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',

          backgroundColor: theme.HEADER_BACKGROUND_COLOR,
          borderBottomColor: theme.HEADER_BORDER_COLOR,
        })}
      >
        <div
          css={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            '& > *': {
              flex: '0 1 auto',
            },
          }}
        >
          {tabs.map((tab) => (
            <button
              type="button"
              id={renderTabPanelButtonId(tab.value)}
              aria-selected={tab.value === selectedTab}
              role={'tab'}
              onClick={() => this.handleTabClick(tab)}
              key={tab.value}
              css={[
                (theme) => ({
                  cursor: 'pointer',
                  position: 'relative',
                  height: '33px',
                  padding: '0 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: 'none',
                  outline: 'none',
                  color: theme.TEXT_COLOR,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderLeftWidth: 0,

                  '&:first-of-type': {
                    borderLeftWidth: '1px',
                    borderTopLeftRadius: '3px',
                    borderBottomLeftRadius: '3px',
                  },

                  '&:last-of-type': {
                    borderTopRightRadius: '3px',
                    borderBottomRightRadius: '3px',
                  },

                  backgroundColor: theme.TAB_BACK_COLOR,

                  '&:hover': {
                    backgroundColor: theme.TAB_BACK_HOVER_COLOR,
                  },

                  borderColor: theme.TAB_BORDER_COLOR,

                  '& > *': {
                    display: '-webkit-box',
                    boxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    overflow: 'hidden',
                    wordBreak: 'break-all',
                    WebkitBoxPack: 'end',
                    paddingBottom: 0,
                  },
                }),
                tab.value === selectedTab &&
                  ((theme) => ({
                    backgroundColor: theme.TAB_BACK_SELECTED_COLOR,
                  })),
              ]}
            >
              <span>{renderTabLabel ? renderTabLabel(tab) : tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  static defaultProps = {
    tabs: emptyArray,
  };
}
