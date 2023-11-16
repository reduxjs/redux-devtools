import { StylingFunction } from 'react-base16-styling';
import React, { ReactElement } from 'react';

export const BUTTON_DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

interface JumpSearchResultButtonProps {
  buttonDirection: string;
  buttonDisabled: boolean;
  styling: StylingFunction;
  jumpToNewResult: () => void;
}

function JumpSearchResultButton({
  buttonDirection,
  buttonDisabled,
  styling,
  jumpToNewResult,
}: JumpSearchResultButtonProps): ReactElement {
  return (
    <button
      {...styling('jumpResultButton')}
      onClick={() => jumpToNewResult()}
      disabled={buttonDisabled}
    >
      <svg
        {...styling('jumpResultButtonArrow')}
        viewBox="4 0 14 18"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {buttonDirection === BUTTON_DIRECTION.LEFT ? (
            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59-1.41-1.41-6 6 6 6z" />
          ) : (
            <path d="M8.59 16.34l4.58-4.59-4.58-4.59 1.41-1.41 6 6-6 6z" />
          )}
        </g>
      </svg>
    </button>
  );
}

export default JumpSearchResultButton;
