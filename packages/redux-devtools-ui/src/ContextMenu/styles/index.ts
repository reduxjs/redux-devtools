import { css, ThemedStyledProps } from 'styled-components';
import { Theme } from '../../themes/default';

interface StyleProps {
  left: number;
  top: number;
  visible: boolean | undefined;
}

export default ({
  theme,
  left,
  top,
  visible,
}: ThemedStyledProps<StyleProps, Theme>) => css`
  ${visible
    ? `
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s linear;
    `
    : `
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.2s, opacity 0.2s linear;
  `}
  position: fixed;
  top: ${top}px;
  left: ${left}px;
  font-size: 14px;
  color: ${theme.base07};
  cursor: pointer;
  display: block;
  line-height: ${theme.inputInternalHeight / 2}px;
  border: 1px solid ${theme.base02};

  button {
    box-sizing: border-box;
    background-color: ${theme.base00};
    color: ${theme.base07};
    cursor: pointer;
    display: block;
    padding: ${theme.inputHeight / 3}px;
    line-height: ${theme.inputInternalHeight / 2}px;
    border: none;
    white-space: nowrap;

    &:hover {
      background-color: ${theme.base02};
      color: ${theme.base07};
    }
    &:focus {
      outline: 0;
    }
  }
`;
