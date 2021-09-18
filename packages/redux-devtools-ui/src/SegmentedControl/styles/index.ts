import { css, ThemedStyledProps } from 'styled-components';
import color from '../../utils/color';
import { Theme } from '../../themes/default';

interface StyleProps {
  disabled: boolean | undefined;
}

export default ({
  theme,
  disabled,
}: ThemedStyledProps<StyleProps, Theme>) => css`
  display: flex;
  flex-shrink: 0;

  > [data-selected],
  > [data-selected]:hover {
    background-color: ${theme.base04};
    color: ${theme.base00};
  }

  > button {
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;
    -webkit-font-smoothing: antialiased;
    min-height: 30px;
    border: 1px solid ${color(theme.base03, 'alpha', 0.4)};
    border-left-width: 0;
    padding: 5px 10px;
    ${disabled
      ? `
    cursor: not-allowed;
    opacity: 0.6;
    `
      : `
    cursor: pointer;
    color: ${theme.base05};
    background-color: ${theme.base01};

    &:hover, &:focus {
      background-color: ${theme.base02};
      color: ${theme.base07};
    }
    `}

    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      border-left-width: 1px;
    }

    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
`;
