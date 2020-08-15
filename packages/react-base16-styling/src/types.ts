import { Base16Theme } from 'base16';
import * as CSS from 'csstype';

export type StylingValue = string | CSS.Properties |

export interface StylingConfig {
  extend?: string | Base16Theme;
  [name: string]: StylingValue;
}

export type Theme = string | Base16Theme | StylingConfig;
