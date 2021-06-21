import React, { MouseEvent } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';

export const ascId = 'rtk-query-rb-asc';
export const descId = 'rtk-query-rb-desc';

export interface SortOrderButtonsProps {
  readonly isAsc?: boolean;
  readonly onChange: (isAsc: boolean) => void;
}

export function SortOrderButtons({
  isAsc,
  onChange,
}: SortOrderButtonsProps): JSX.Element {
  const handleButtonGroupClick = ({
    target,
  }: MouseEvent<HTMLElement>): void => {
    const targetId = (target as HTMLElement)?.id ?? null;

    if (targetId === ascId && !isAsc) {
      onChange(true);
    } else if (targetId === descId && isAsc) {
      onChange(false);
    }
  };

  const isDesc = !isAsc;

  return (
    <StyleUtilsContext.Consumer>
      {({ styling }) => (
        <div
          tabIndex={0}
          role="radiogroup"
          aria-activedescendant={isAsc ? ascId : descId}
          onClick={handleButtonGroupClick}
        >
          <button
            role="radio"
            type="button"
            id={ascId}
            aria-checked={isAsc}
            {...styling(
              ['selectorButton', isAsc && 'selectorButtonSelected'],
              isAsc
            )}
          >
            asc
          </button>
          <button
            id={descId}
            role="radio"
            type="button"
            aria-checked={isDesc}
            {...styling(
              ['selectorButton', isDesc && 'selectorButtonSelected'],
              isDesc
            )}
          >
            desc
          </button>
        </div>
      )}
    </StyleUtilsContext.Consumer>
  );
}
