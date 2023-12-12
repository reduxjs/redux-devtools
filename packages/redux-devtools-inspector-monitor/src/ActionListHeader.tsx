import React, { FunctionComponent } from 'react';
import { StylingFunction } from 'react-base16-styling';
import RightSlider from './RightSlider';
import {
  actionListHeaderCss,
  actionListHeaderSearchCss,
  actionListHeaderSelectorCss,
  actionListHeaderWrapperCss,
  selectorButtonCss,
  selectorButtonSmallCss,
} from './utils/createStylingFromTheme';

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
  <div css={actionListHeaderCss}>
    <input
      css={actionListHeaderSearchCss}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="filter..."
      value={searchValue}
    />
    {!hideMainButtons && (
      <div css={actionListHeaderWrapperCss}>
        <RightSlider shown={hasStagedActions} styling={styling}>
          <div css={actionListHeaderSelectorCss}>
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
