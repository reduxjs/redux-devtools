import React, { FunctionComponent } from 'react';
import { Action } from 'redux';
import { css } from '@emotion/react';
import type { Interpolation, Theme } from '@emotion/react';
import { Tab } from './ActionPreview';
import {
  selectorButtonCss,
  selectorButtonSelectedCss,
} from './utils/selectorButtonStyles';

const inspectedPathKeyCss = css({
  '&:not(:last-child):after': {
    content: '" > "',
  },
});

const inspectedPathKeyLinkCss: Interpolation<Theme> = (theme) => ({
  cursor: 'pointer',
  color: theme.LINK_COLOR,
  '&:hover': {
    textDecoration: 'underline',
    color: theme.LINK_HOVER_COLOR,
  },
});

interface Props<S, A extends Action<string>> {
  tabs: Tab<S, A>[];
  inspectedPath: (string | number)[];
  onInspectPath: (path: (string | number)[]) => void;
  tabName: string;
  onSelectTab: (tabName: string) => void;
}

const ActionPreviewHeader: FunctionComponent<
  Props<unknown, Action<string>>
> = ({ inspectedPath, onInspectPath, tabName, onSelectTab, tabs }) => (
  <div
    key="previewHeader"
    css={(theme) => ({
      flex: '0 0 30px',
      padding: '5px 10px',
      alignItems: 'center',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',

      backgroundColor: theme.HEADER_BACKGROUND_COLOR,
      borderBottomColor: theme.HEADER_BORDER_COLOR,
    })}
  >
    <div css={{ position: 'relative', display: 'inline-flex', float: 'right' }}>
      {tabs.map((tab) => (
        <div
          onClick={() => onSelectTab(tab.name)}
          key={tab.name}
          css={[
            selectorButtonCss,
            tab.name === tabName && selectorButtonSelectedCss,
          ]}
        >
          {tab.name}
        </div>
      ))}
    </div>
    <div css={{ padding: '6px 0' }}>
      {inspectedPath.length ? (
        <span css={inspectedPathKeyCss}>
          <a onClick={() => onInspectPath([])} css={inspectedPathKeyLinkCss}>
            {tabName}
          </a>
        </span>
      ) : (
        tabName
      )}
      {inspectedPath.map((key, idx) =>
        idx === inspectedPath.length - 1 ? (
          <span key={key}>{key}</span>
        ) : (
          <span key={key} css={inspectedPathKeyCss}>
            <a
              onClick={() => onInspectPath(inspectedPath.slice(0, idx + 1))}
              css={inspectedPathKeyLinkCss}
            >
              {key}
            </a>
          </span>
        ),
      )}
    </div>
  </div>
);

export default ActionPreviewHeader;
