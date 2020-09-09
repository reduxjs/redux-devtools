import { css, keyframes } from 'styled-components';
import { Theme } from '../themes/default';

export const spin = keyframes`
  to { transform: rotate(1turn); }
`;
export const spinner = (theme: Theme) => css`
  animation: ${spin} 400ms infinite linear;
  width: ${theme.spinnerSize}px;
  height: ${theme.spinnerSize}px;
  box-sizing: border-box;
  border-radius: 50%;
  border: ${Math.floor(theme.spinnerSize / 8)}px solid ${theme.base02};
  border-right-color: ${theme.base06};
  display: inline-block;
  position: relative;
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Based on https://github.com/mladenplavsic/css-ripple-effect
export const ripple = (theme: Theme) => `
  & {
    position: relative;
    overflow: hidden;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, ${theme.base07} 11%, transparent 11%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 1s;
  }

  &:active:after {
    transform: scale(0, 0);
    opacity: .2;
    transition: 0s;
  }
`;

export const animationCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';
