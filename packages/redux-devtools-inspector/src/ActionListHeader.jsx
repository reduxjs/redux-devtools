import React from 'react';
import RightSlider from './RightSlider';

const getActiveButtons = (hasSkippedActions) =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter((a) => a);

const ActionListHeader = ({
  styling,
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons,
}) => (
  <div {...styling('actionListHeader')}>
    <input
      {...styling('actionListHeaderSearch')}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="filter..."
    />
    {!hideMainButtons && (
      <div {...styling('actionListHeaderWrapper')}>
        <RightSlider shown={hasStagedActions} styling={styling}>
          <div {...styling('actionListHeaderSelector')}>
            {getActiveButtons(hasSkippedActions).map((btn) => (
              <div
                key={btn}
                onClick={() =>
                  ({
                    Commit: onCommit,
                    Sweep: onSweep,
                  }[btn]())
                }
                {...styling(
                  ['selectorButton', 'selectorButtonSmall'],
                  false,
                  true
                )}
              >
                {btn}
              </div>
            ))}
          </div>
        </RightSlider>
      </div>
    )}
  </div>
);

export default ActionListHeader;
