import { css, ThemedStyledProps } from 'styled-components';
import { prefixSelectors } from '../../utils/autoPrefix';
import color from '../../utils/color';
import { animationCurve } from '../../utils/animations';
import { StyleProps } from './default';
import { Theme } from '../../themes/default';

export const style = ({
  theme,
  percent,
  disabled,
  withLabel,
}: ThemedStyledProps<StyleProps, Theme>) => css`
  display: block;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: ${withLabel ? '2em 0' : '0'};

  label {
    position: absolute;
    display: block;
    font-size: 11px;
    padding: 0.3em 0.5em;
    top: 0;
    width: 100%;
    color: ${theme.base06};

    > span {
      color: ${theme.base04};
    }
  }

  input {
    opacity: ${disabled ? '0.7' : '1'};
    outline: none;
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin: 0;
    cursor: pointer;
    color: inherit;
    background-color: ${theme.base02};
    background-image: linear-gradient(
      90deg,
      currentcolor,
      currentcolor ${percent}%,
      transparent ${percent}%
    );
    background-clip: content-box;
    height: 0.5em;
    border-radius: 999px;
    appearance: none;
    font-size: 1em;
  }

  ${prefixSelectors(
    'input',
    ['webkit-slider-thumb', 'moz-range-thumb', 'ms-thumb'],
    `{
    width: 1.5em;
    height: 1.5em;
    background-image: none;
    background-color: ${percent === 0 ? theme.base00 : 'currentcolor'};
    border: ${percent === 0 ? `5px solid ${theme.base03}` : 'none'};;
    border-radius: 50%;
    appearance: none;
    transition: transform 0.18s ${animationCurve},
      border 0.18s ${animationCurve},
      box-shadow 0.18s ${animationCurve},
      background 0.28s ${animationCurve};
  }`,
  )}

  ${prefixSelectors(
    'input:focus:not(:active)',
    ['webkit-slider-thumb', 'moz-range-thumb', 'ms-thumb'],
    `{
    box-shadow: 0 0 0 8px ${color(theme.base0D, 'alpha', 0.5)};
    transform: scale(1.2);
  }`,
  )}

  input::-moz-focus-outer {
    border: 0;
  }
`;
