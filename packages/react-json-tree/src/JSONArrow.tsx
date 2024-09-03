import React from 'react';
import type { StylingFunction } from 'react-base16-styling';

interface Props {
  styling: StylingFunction;
  arrowStyle?: 'single' | 'double';
  expanded: boolean;
  nodeType: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ariaControls?: string;
  ariaLabel?: string
}

export default function JSONArrow({
  styling,
  arrowStyle = 'single',
  expanded,
  nodeType,
  onClick,
  ariaControls,
  ariaLabel
}: Props) {
  return (
    <button {...styling('arrowContainer', arrowStyle)} aria-label={ariaLabel} aria-expanded={expanded} aria-controls={ariaControls} onClick={onClick}>
      <div {...styling(['arrow', 'arrowSign'], nodeType, expanded, arrowStyle)}>
        {'\u25B6'}
        {arrowStyle === 'double' && (
          <div {...styling(['arrowSign', 'arrowSignInner'])}>{'\u25B6'}</div>
        )}
      </div>
    </button>
  );
}
