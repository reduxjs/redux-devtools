import { css, ThemedStyledProps } from 'styled-components';
import { Theme } from '../../themes/default';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const containerStyle = ({ theme }: ThemedStyledProps<{}, Theme>) => css`
  display: flex;
  align-items: center;

  div {
    margin-left: 4px;
    padding: 0.3em 0.5em;
    border: ${theme.inputBorderWidth}px solid ${theme.inputBorderColor};
    border-radius: ${theme.inputBorderRadius}px;
    background-color: ${theme.base00};
    opacity: 0.7;
  }
`;
