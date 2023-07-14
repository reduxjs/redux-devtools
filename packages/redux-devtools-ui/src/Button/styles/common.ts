import { css, ThemedStyledProps } from 'styled-components';
import { fadeIn } from '../../utils/animations';
import colorEffect from '../../utils/color';
import { Mark, Size, TooltipPosition } from '../Button';
import { Theme } from '../../themes/default';

const both = (tooltipPosition: TooltipPosition) => {
  switch (tooltipPosition) {
    case 'bottom':
      return `
      transform: translate(-50%, 100%);
      top: auto;
      `;
    case 'left':
      return `
      transform: translate(-100%, -50%);
      top: 50%;
      right: auto;
      `;
    case 'right':
      return `
      transform: translate(100%, -50%);
      top: 50%;
      left: auto;
      `;
    case 'bottom-left':
      return `
      transform: translate(-100%, 100%);
      top: auto;
      `;
    case 'bottom-right':
      return `
      transform: translateY(100%);
      top: auto;
      `;
    case 'top-left':
      return `
      transform: translate(-100%, -100%);
      `;
    case 'top-right':
      return `
      transform: translateY(-100%);
      `;
    default:
      return `
       transform: translate(-50%, -100%);
      `;
  }
};

const before = (tooltipPosition: TooltipPosition) => {
  switch (tooltipPosition) {
    case 'bottom-left':
      return `
      left: calc(50% + 11px);
      `;
    case 'bottom-right':
      return `
      left: calc(50% - 11px);
      `;
    case 'top-left':
      return `
      left: calc(50% + 11px);
      `;
    case 'top-right':
      return `
      left: calc(50% - 11px);
      `;
    default:
      return '';
  }
};

const after = (tooltipPosition: TooltipPosition, color: string) => {
  switch (tooltipPosition) {
    case 'bottom':
      return `
      border-color: transparent transparent ${color} transparent;
      `;
    case 'left':
      return `
      border-color: transparent transparent transparent ${color};
      `;
    case 'right':
      return `
      border-color: transparent ${color} transparent transparent;
      `;
    case 'bottom-left':
      return `
      left: calc(50% + 10px);
      border-color: transparent transparent ${color} transparent;
      `;
    case 'bottom-right':
      return `
      left: calc(50% - 10px);
      border-color: transparent transparent ${color} transparent;
      `;
    case 'top-left':
      return `
      left: calc(50% + 10px);
      border-color: ${color} transparent transparent transparent;
      `;
    case 'top-right':
      return `
      left: calc(50% - 10px);
      border-color: ${color} transparent transparent transparent;
      `;
    default:
      return `
       border-color: ${color} transparent transparent transparent;
      `;
  }
};

const getDirection = (tooltipPosition: TooltipPosition) => {
  return tooltipPosition.indexOf('-') > 0
    ? tooltipPosition.substring(0, tooltipPosition.indexOf('-'))
    : tooltipPosition;
};

const getSize = (size: Size | undefined) => {
  switch (size) {
    case 'big':
      return 'min-height: 34px; padding: 2px 12px;';
    case 'small':
      return 'padding: 0;';
    default:
      return 'min-height: 30px; padding: 2px 7px;';
  }
};

interface CommonStyleProps {
  size: Size | undefined;
  mark: Mark | false | undefined;
}

export const commonStyle = ({
  theme,
  mark,
  size,
}: ThemedStyledProps<CommonStyleProps, Theme>) => css`
  display: inline-block;
  position: relative;
  flex-shrink: 0;
  line-height: 0;
  margin: 0 1px;

  & > button {
    width: 100%;
    line-height: 0;
    ${getSize(size)}

    > svg {
      font-size: 1.5em;
      overflow: visible;
      pointer-events: none;
    }

    ${mark &&
    `
    background-color: ${colorEffect(
      theme[mark],
      'fade',
      theme.light ? 0.92 : 0.82,
    )};
  
    > svg {
      color: ${theme[mark]};
      stroke: ${theme[mark]};
      stroke-width: 14px;
      stroke-opacity: 0.2;
      user-select: none;
    }
  `}
  }
`;

interface TooltipStyleProps {
  tooltipTitle: string | undefined;
  tooltipPosition: TooltipPosition;
  size: Size | undefined;
  mark: Mark | false | undefined;
}

export const tooltipStyle = ({
  theme,
  tooltipTitle,
  tooltipPosition,
  mark,
  size,
}: ThemedStyledProps<TooltipStyleProps, Theme>) => css`
  ${commonStyle({ theme, mark, size })}

  &:before {
    content: '${tooltipTitle}';
    white-space: pre;
    color: ${theme.base06};
    line-height: 16px;
    padding: 4px 8px;
    border-radius: 3px;
    background: ${theme.base01};
    border: 1px solid ${theme.base02};
    box-shadow:
      1px 1px 2px -1px ${theme.base02},
      1px 1px 2px 0px ${theme.base02};
  }

  &:after,
  &:before {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 50%;
    z-index: 999;
    ${both(tooltipPosition)}
    user-select: none;
  }

  &:before {
    transition: 0.3s ease-in-out;
  }

  &:before {
    ${before(tooltipPosition)}
    ${getDirection(tooltipPosition)}: 3px;
    ${theme.type === 'material'
      ? css`
          animation: ${fadeIn} 500ms;
        `
      : ''}
  }

  ${theme.type !== 'material' &&
  `
  &:after {
    content: "";
    border-style: solid;
    border-width: 7px;
    margin: 1px;
    ${after(tooltipPosition, theme.base02)}
    ${getDirection(tooltipPosition)}: 7px;
  }
  `}

  &:hover:after,
  &:hover:before {
    opacity: 0.9;
    visibility: visible;
  }
  &:hover:after {
    ${getDirection(tooltipPosition)}: 8px;
    transition-delay: 500ms;
  }
  &:hover:before {
    ${getDirection(tooltipPosition)}: -4px;
    transition-delay: 200ms;
  }
`;
