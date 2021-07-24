import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { StylingFunction } from 'react-base16-styling';
import RightSlider from './RightSlider';
import { ActionForm } from './redux';

const getActiveButtons = (hasSkippedActions: boolean): ('Sweep' | 'Commit')[] =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter(
    (a): a is 'Sweep' | 'Commit' => !!a
  );

interface Props {
  styling: StylingFunction;
  onSearch: (value: string) => void;
  onCommit: () => void;
  onSweep: () => void;
  hideMainButtons: boolean | undefined;
  hasSkippedActions: boolean;
  hasStagedActions: boolean;
  actionForm: ActionForm;
  onActionFormChange: (formValues: Partial<ActionForm>) => void;
}

const ActionListHeader: FunctionComponent<Props> = ({
  styling,
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons,
  actionForm,
  onActionFormChange,
}) => {
  const { isNoopFilterActive } = actionForm;

  return (
    <>
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
      <div {...styling(['actionListHeader', 'actionListHeaderSecondRow'])}>
        <button
          title="Toggle visibility of noop actions"
          aria-label="Toggle visibility of noop actions"
          aria-pressed={!isNoopFilterActive}
          onClick={() =>
            onActionFormChange({ isNoopFilterActive: !isNoopFilterActive })
          }
          type="button"
          {...styling(
            ['selectorButton', 'selectorButtonSmall', !isNoopFilterActive && 'selectorButtonSelected'],
            isNoopFilterActive
          )}
        >
          noop
        </button>
      </div>
    </>
  );
};

ActionListHeader.propTypes = {
  styling: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onSweep: PropTypes.func.isRequired,
  hideMainButtons: PropTypes.bool,
  hasSkippedActions: PropTypes.bool.isRequired,
  hasStagedActions: PropTypes.bool.isRequired,
  actionForm: PropTypes.shape({
    searchValue: PropTypes.string.isRequired,
    isNoopFilterActive: PropTypes.bool.isRequired,
  }).isRequired,
  onActionFormChange: PropTypes.func.isRequired,
};

export default ActionListHeader;
