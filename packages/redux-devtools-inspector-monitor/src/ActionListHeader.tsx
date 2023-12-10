import React, { FunctionComponent } from 'react';
import { StylingFunction } from 'react-base16-styling';
import RightSlider from './RightSlider';

const getActiveButtons = (hasSkippedActions: boolean): ('Sweep' | 'Commit')[] =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter(
    (a): a is 'Sweep' | 'Commit' => !!a,
  );

interface Props {
  styling: StylingFunction;
  onSearch: (value: string) => void;
  onCommit: () => void;
  onSweep: () => void;
  hideMainButtons: boolean | undefined;
  hasSkippedActions: boolean;
  hasStagedActions: boolean;
  searchValue: string | undefined;
}

const ActionListHeader: FunctionComponent<Props> = ({
  styling,
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons,
  searchValue,
}) => (
  <div {...styling('actionListHeader')}>
    <input
      {...styling('actionListHeaderSearch')}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="filter..."
      value={searchValue}
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
                  })[btn]()
                }
                {...styling(
                  ['selectorButton', 'selectorButtonSmall'],
                  false,
                  true,
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
