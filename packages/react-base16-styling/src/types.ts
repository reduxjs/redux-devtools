import { Base16Theme } from 'base16';
import * as CSS from 'csstype';

export interface Styling {
  className?: string;
  style?: CSS.Properties<string | number>;
}

export type StylingValueFunction = (
  styling: Styling,
  ...rest: any[]
) => Styling;

export type StylingValue =
  | string
  | CSS.Properties<string | number>
  | StylingValueFunction;

export type StylingConfig = {
  // Should actually only be string | Base16Theme
  extend?: string | Base16Theme | StylingValue;
} & {
  // Should actually only be StylingValue
  [name: string]: StylingValue | string | Base16Theme;
};

export type Theme = string | Base16Theme | StylingConfig;

export type StylingFunction = (
  keys: string | string[],
  ...rest: any[]
) => Styling;
