import React from 'react';
import PropTypes from 'prop-types';
import { StylingFunction } from 'react-base16-styling';
import { Action } from 'redux';
import { Tab } from './ActionPreview';

interface Props<S, A extends Action<unknown>> {
  styling: StylingFunction;
  inspectedPath: (string | number)[];
  onInspectPath: (path: (string | number)[]) => void;
  tabName: string;
  onSelectTab: (tabName: string) => void;
  tabs: Tab<S, A>[];
}

const ActionPreviewHeader: React.FunctionComponent<Props<
  unknown,
  Action<unknown>
>> = <S, A extends Action<unknown>>({
  styling,
  inspectedPath,
  onInspectPath,
  tabName,
  onSelectTab,
  tabs
}: Props<S, A>) => (
  <div key="previewHeader" {...styling('previewHeader')}>
    <div {...styling('tabSelector')}>
      {tabs.map((tab: Tab<S, A>) => (
        <div
          onClick={() => onSelectTab(tab.name)}
          key={tab.name}
          {...styling(
            [
              'selectorButton',
              tab.name === tabName && 'selectorButtonSelected'
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
      {inspectedPath.map((key: string | number, idx: number) =>
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
  styling: PropTypes.func.isRequired,
  inspectedPath: PropTypes.array.isRequired,
  onInspectPath: PropTypes.func.isRequired,
  tabName: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired
};

export default ActionPreviewHeader;
