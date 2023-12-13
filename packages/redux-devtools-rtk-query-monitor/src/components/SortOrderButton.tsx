import React, { CSSProperties } from 'react';
import { ArrowUpIcon } from './ArrowUpIcon';

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
    <button
      type="button"
      id={id}
      onClick={handleButtonClick}
      aria-pressed={isAsc}
      css={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexFlow: 'row nowrap',
        cursor: 'pointer',
        position: 'relative',
        padding: '0 8px',
        color: theme.TEXT_COLOR,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '3px',
        backgroundColor: theme.TAB_BACK_COLOR,
        borderColor: theme.TAB_BORDER_COLOR,
        height: 30,
        fontSize: 12,
        width: 64,

        '&:active': {
          backgroundColor: theme.TAB_BACK_SELECTED_COLOR,
        },
      })}
    >
      <ArrowUpIcon style={arrowStyles} />
      {buttonLabel}
    </button>
  );
}
