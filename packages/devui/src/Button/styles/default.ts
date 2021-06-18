import { css, ThemedStyledProps } from 'styled-components';
import { Theme } from '../../themes/default';

export interface StyleProps {
  primary: boolean | undefined;
  disabled: boolean | undefined;
}

export const style = ({
  theme,
  primary,
  disabled,
}: ThemedStyledProps<StyleProps, Theme>) => css`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  outline: none;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.5s;
  margin: auto 0;
  border: 1px solid ${theme.base02};
  border-radius: 4px;
  ${primary
    ? `
  background-color: ${theme.base05};
  color: ${theme.base00};
  `
    : `
  background-color: ${theme.base01};
  color: ${theme.base05};
 `}
  ${disabled
    ? `
  cursor: not-allowed;
  opacity: 0.6;
  `
    : `
  cursor: pointer;
  `}

  ${!disabled &&
  `
  &:hover,
  &:focus {
    background-color: ${primary ? theme.base07 : theme.base02};
    box-shadow: 1px 1px 2px ${theme.base03};
  }
 `}
  &:focus {
    border: 1px solid ${theme.base0D};
  }
  &:active {
    border: 1px solid ${theme.base03};
    box-shadow: 1px 1px 2px ${theme.base04};
  }
`;
