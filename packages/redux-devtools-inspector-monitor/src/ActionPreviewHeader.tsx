import React, { FunctionComponent } from 'react';
import { Action } from 'redux';
import { Tab } from './ActionPreview';
import {
  inspectedPathCss,
  inspectedPathKeyCss,
  inspectedPathKeyLinkCss,
  previewHeaderCss,
  selectorButtonCss,
  selectorButtonSelectedCss,
  tabSelectorCss,
} from './utils/createStylingFromTheme';

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
  <div key="previewHeader" css={previewHeaderCss}>
    <div css={tabSelectorCss}>
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
    <div css={inspectedPathCss}>
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
