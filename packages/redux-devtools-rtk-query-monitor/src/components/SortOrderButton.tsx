import React, { CSSProperties } from 'react';
import { ArrowUpIcon } from './ArrowUpIcon';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';

export interface SortOrderButtonProps {
  readonly isAsc?: boolean;
  readonly onChange: (isAsc: boolean) => void;
  id?: string;
}

export function SortOrderButton({
  isAsc,
  onChange,
  id,
}: SortOrderButtonProps): JSX.Element {
  const handleButtonClick = (): void => {
    if (!isAsc) {
      onChange(true);
    } else onChange(false);
  };

  const buttonLabel = isAsc ? 'asc' : 'desc';

  const arrowStyles: CSSProperties = {
    width: '1em',
    height: '1em',
    transform: !isAsc ? 'scaleY(-1)' : undefined,
  };

  return (
    <StyleUtilsContext.Consumer>
      {({ styling }) => (
        <button
          type="button"
          id={id}
          onClick={handleButtonClick}
          aria-pressed={isAsc}
          {...styling(['sortButton'])}
        >
          <ArrowUpIcon style={arrowStyles} />
          {buttonLabel}
        </button>
      )}
    </StyleUtilsContext.Consumer>
  );
}
