import type { Base16Theme } from 'react-base16-styling';

function invertColors(theme: Base16Theme) {
  return {
    ...theme,
    base00: theme.base07,
    base01: theme.base06,
    base02: theme.base05,
    base03: theme.base04,
    base04: theme.base03,
    base05: theme.base02,
    base06: theme.base01,
    base07: theme.base00,
  };
}

export default invertColors;
