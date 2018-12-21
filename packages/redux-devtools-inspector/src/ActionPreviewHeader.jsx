import React from 'react';

const ActionPreviewHeader =
  ({ styling, inspectedPath, onInspectPath, tabName, onSelectTab, tabs }) =>
    (<div key='previewHeader' {...styling('previewHeader')}>
      <div {...styling('tabSelector')}>
        {tabs.map(tab =>
          (<div onClick={() => onSelectTab(tab.name)}
            key={tab.name}
            {...styling([
              'selectorButton',
              tab.name === tabName && 'selectorButtonSelected'
            ], tab.name === tabName)}>
            {tab.name}
          </div>)
        )}
      </div>
      <div {...styling('inspectedPath')}>
        {inspectedPath.length ?
          <span {...styling('inspectedPathKey')}>
            <a onClick={() => onInspectPath([])}
              {...styling('inspectedPathKeyLink')}>
              {tabName}
            </a>
          </span> : tabName
        }
        {inspectedPath.map((key, idx) =>
          idx === inspectedPath.length - 1 ? <span key={key}>{key}</span> :
            <span key={key}
              {...styling('inspectedPathKey')}>
              <a onClick={() => onInspectPath(inspectedPath.slice(0, idx + 1))}
                {...styling('inspectedPathKeyLink')}>
                {key}
              </a>
            </span>
        )}
      </div>
    </div>);

export default ActionPreviewHeader;
