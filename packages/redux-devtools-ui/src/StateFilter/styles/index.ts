import { css, ThemedStyledProps } from 'styled-components';

import { Theme } from '../../themes/default';

// eslint-disable-next-line @typescript-eslint/ban-types
export default ({ theme }: ThemedStyledProps<{}, Theme>) => css`
  align-self: center;
  height: 100%;
  border-bottom: 0.5px solid;

  input {
    background: transparent;
    border: none;
    outline: none;
    color: ${theme.base06};
  }
  input::-webkit-input-placeholder {
    color: ${theme.base06};
    opacity: 0.6;
  }
  input::-moz-placeholder {
    color: ${theme.base06};
    opacity: 0.6;
  }
  button[aria-pressed='true'] {
    filter: invert();
  }
  button:focus {
  }
`;
