import React, { FunctionComponent } from 'react';
import RightSlider from './RightSlider';
import {
  selectorButtonCss,
  selectorButtonSmallCss,
} from './utils/selectorButtonStyles';

const getActiveButtons = (hasSkippedActions: boolean): ('Sweep' | 'Commit')[] =>
  [hasSkippedActions && 'Sweep', 'Commit'].filter(
    (a): a is 'Sweep' | 'Commit' => !!a,
  );

interface Props {
  onSearch: (value: string) => void;
  onCommit: () => void;
  onSweep: () => void;
  hideMainButtons: boolean | undefined;
  hasSkippedActions: boolean;
  hasStagedActions: boolean;
  searchValue: string | undefined;
}

const ActionListHeader: FunctionComponent<Props> = ({
  onSearch,
  hasSkippedActions,
  hasStagedActions,
  onCommit,
  onSweep,
  hideMainButtons,
  searchValue,
}) => (
  <div
    css={(theme) => ({
      display: 'flex',
      flex: '0 0 auto',
      alignItems: 'center',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',

      borderColor: theme.LIST_BORDER_COLOR,
    })}
  >
    <input
      css={(theme) => ({
        outline: 'none',
        border: 'none',
        width: '100%',
        padding: '5px 10px',
        fontSize: '1em',
        fontFamily: 'monaco, Consolas, "Lucida Console", monospace',

        backgroundColor: theme.BACKGROUND_COLOR,
        color: theme.TEXT_COLOR,

        '&::-webkit-input-placeholder': {
          color: theme.TEXT_PLACEHOLDER_COLOR,
        },

        '&::-moz-placeholder': {
          color: theme.TEXT_PLACEHOLDER_COLOR,
        },
      })}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="filter..."
      value={searchValue}
    />
    {!hideMainButtons && (
      <div css={{ position: 'relative', height: '20px' }}>
        <RightSlider shown={hasStagedActions}>
          <div css={{ display: 'inline-flex', marginRight: '10px' }}>
            {getActiveButtons(hasSkippedActions).map((btn) => (
              <div
                key={btn}
                onClick={() =>
                  ({
                    Commit: onCommit,
                    Sweep: onSweep,
                  })[btn]()
                }
                css={[selectorButtonCss, selectorButtonSmallCss]}
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
