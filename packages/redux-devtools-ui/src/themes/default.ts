import type { Base16Theme } from 'react-base16-styling';
import * as CSS from 'csstype';
import * as themes from './index';

export interface Theme extends Base16Theme {
  fontFamily: CSS.Property.FontFamily;
  codeFontFamily: CSS.Property.FontFamily;
  inputHeight: number;
  inputBorderWidth: number;
  inputBorderRadius: number;
  spinnerSize: number;
  inputPadding: number;
  selectArrowWidth: number;
  inputInternalHeight: number;
  inputBorderColor: string;
  inputFocusedStyle: string;
  type?: keyof typeof themes;
  light?: boolean;
}

export default (colors: Base16Theme) => ({
  ...colors,
  fontFamily: "'Source Sans Pro', sans-serif",
  codeFontFamily: "'Source Code Pro', monospace",
  inputHeight: 30,
  inputBorderWidth: 1,
  inputBorderRadius: 4,
  spinnerSize: 13, // Math.floor(theme.inputHeight / 2) - 2
  inputPadding: 10, // theme.inputHeight / 3
  selectArrowWidth: 4, // Math.floor(theme.inputHeight / 7)
  inputInternalHeight: 28, // theme.inputHeight - theme.inputBorderWidth * 2
  inputBorderColor: colors.base02,
  inputFocusedStyle: `border-color: ${colors.base0D}`,
});
