import type { Base16Theme } from 'react-base16-styling';

export default (colors: Base16Theme) => ({
  fontFamily: "'Roboto', sans-serif",
  codeFontFamily: "'Roboto Mono', monospace",
  inputPadding: 5,
  inputBorderRadius: 0,
  inputBorderColor: `transparent transparent ${colors.base02}`,
  inputFocusedStyle: `box-shadow: inset 0 -2px 0 ${colors.base0D};`,
});
