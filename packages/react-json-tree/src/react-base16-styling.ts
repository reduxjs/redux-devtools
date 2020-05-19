declare module 'react-base16-styling' {
  import React from 'react';

  export interface Styling {
    style?: React.CSSProperties;
    className?: string;
  }

  export interface Base16Theme {
    scheme?: string;
    author?: string;
    base00: string;
    base01: string;
    base02: string;
    base03: string;
    base04: string;
    base05: string;
    base06: string;
    base07: string;
    base08: string;
    base09: string;
    base0A: string;
    base0B: string;
    base0C: string;
    base0D: string;
    base0E: string;
    base0F: string;
  }

  export type StylingValue =
    | string
    | React.CSSProperties
    | ((styling: Styling, ...rest: any[]) => Styling);

  export type StylingConfig = { [name: string]: StylingValue } & {
    extend?: string | Base16Theme | StylingValue;
  };

  export type Theme = string | Base16Theme | StylingConfig;

  export type StylingFunction = (
    keys: string | Array<string | undefined | null>,
    ...rest: any[]
  ) => Styling;

  export function invertTheme(base16Theme: Base16Theme): Base16Theme;

  export function createStyling(
    getDefaultStyling: (base16Theme: Base16Theme) => StylingConfig,
    options?: { defaultBase16?: Theme; base16Themes?: Theme[] }
  ): (theme?: Theme, invertTheme?: boolean) => StylingFunction;
}
