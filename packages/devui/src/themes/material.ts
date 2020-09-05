import { Base16Theme } from 'base16';

export default (colors: Base16Theme) => ({
  fontFamily: "'Roboto', sans-serif",
  codeFontFamily: "'Roboto Mono', monospace",
  inputPadding: 5,
  inputBorderRadius: 0,
  inputBorderColor: `transparent transparent ${colors.base02}`,
  inputFocusedStyle: `box-shadow: inset 0 -2px 0 ${colors.base0D};`,
});
