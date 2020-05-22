import React from 'react';
import PropTypes from 'prop-types';
import RightSlider from './RightSlider';
import { StylingFunction } from 'react-base16-styling';

const getActiveButtons = (hasSkippedActions: boolean): ('Sweep' | 'Commit')[] =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter(a => a) as (
    | 'Sweep'
    | 'Commit'
  )[];

interface Props {
  styling: StylingFunction;
  onSearch: (value: string) => void;
  hasSkippedActions: boolean;
  hasStagedActions: boolean;
  onCommit: () => void;
  onSweep: () => void;
  hideMainButtons: boolean | undefined;
}

const ActionListHeader: React.FunctionComponent<Props> = ({
  styling,
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons
}) => (
  <div {...styling('actionListHeader')}>
    <input
      {...styling('actionListHeaderSearch')}
      onChange={e => onSearch(e.target.value)}
      placeholder="filter..."
    />
    {!hideMainButtons && (
      <div {...styling('actionListHeaderWrapper')}>
        <RightSlider shown={hasStagedActions} styling={styling}>
          <div {...styling('actionListHeaderSelector')}>
            {getActiveButtons(hasSkippedActions).map(btn => (
              <div
                key={btn}
                onClick={() =>
                  ({
                    Commit: onCommit,
                    Sweep: onSweep
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

ActionListHeader.propTypes = {
  styling: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  hasSkippedActions: PropTypes.bool.isRequired,
  hasStagedActions: PropTypes.bool.isRequired,
  onCommit: PropTypes.func.isRequired,
  onSweep: PropTypes.func.isRequired,
  hideMainButtons: PropTypes.bool
};

export default ActionListHeader;
