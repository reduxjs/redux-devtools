import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Action } from 'redux';
import { StylingFunction } from 'react-base16-styling';
import { Tab } from './ActionPreview';

interface Props<S, A extends Action<unknown>> {
  tabs: Tab<S, A>[];
  styling: StylingFunction;
  inspectedPath: (string | number)[];
  onInspectPath: (path: (string | number)[]) => void;
  tabName: string;
  onSelectTab: (tabName: string) => void;
}

const ActionPreviewHeader: FunctionComponent<
  Props<unknown, Action<unknown>>
> = ({ styling, inspectedPath, onInspectPath, tabName, onSelectTab, tabs }) => (
  <div key="previewHeader" {...styling('previewHeader')}>
    <div {...styling('tabSelector')}>
      {tabs.map((tab) => (
        <div
          onClick={() => onSelectTab(tab.name)}
          key={tab.name}
          {...styling(
            [
              'selectorButton',
              tab.name === tabName && 'selectorButtonSelected',
            ],
            tab.name === tabName
          )}
        >
          {tab.name}
        </div>
      ))}
    </div>
    <div {...styling('inspectedPath')}>
      {inspectedPath.length ? (
        <span {...styling('inspectedPathKey')}>
          <a
            onClick={() => onInspectPath([])}
            {...styling('inspectedPathKeyLink')}
          >
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
          <span key={key} {...styling('inspectedPathKey')}>
            <a
              onClick={() => onInspectPath(inspectedPath.slice(0, idx + 1))}
              {...styling('inspectedPathKeyLink')}
            >
              {key}
            </a>
          </span>
        )
      )}
    </div>
  </div>
);

ActionPreviewHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  styling: PropTypes.func.isRequired,
  inspectedPath: PropTypes.array.isRequired,
  onInspectPath: PropTypes.func.isRequired,
  tabName: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
};

export default ActionPreviewHeader;
