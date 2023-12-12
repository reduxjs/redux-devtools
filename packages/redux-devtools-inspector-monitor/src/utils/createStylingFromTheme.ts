import jss, { StyleSheet } from 'jss';
import preset from 'jss-preset-default';
import { css } from '@emotion/react';
import type { Interpolation, Theme } from '@emotion/react';
import {
  createStyling,
  StylingFunction,
  Theme as Base16StylingTheme,
} from 'react-base16-styling';
import rgba from 'hex-rgba';
import { Base16Theme } from 'redux-devtools-themes';
import type { CurriedFunction1 } from 'lodash';
import inspector from '../themes/inspector';
import * as reduxThemes from 'redux-devtools-themes';
import * as inspectorThemes from '../themes';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends Base16Theme {}
}

jss.setup(preset());

const colorMap = (theme: Base16Theme) => ({
  TEXT_COLOR: theme.base06,
  TEXT_PLACEHOLDER_COLOR: rgba(theme.base06, 60),
  BACKGROUND_COLOR: theme.base00,
  SELECTED_BACKGROUND_COLOR: rgba(theme.base03, 20),
  SKIPPED_BACKGROUND_COLOR: rgba(theme.base03, 10),
  HEADER_BACKGROUND_COLOR: rgba(theme.base03, 30),
  HEADER_BORDER_COLOR: rgba(theme.base03, 20),
  BORDER_COLOR: rgba(theme.base03, 50),
  LIST_BORDER_COLOR: rgba(theme.base03, 50),
  ACTION_TIME_BACK_COLOR: rgba(theme.base03, 20),
  ACTION_TIME_COLOR: theme.base04,
  PIN_COLOR: theme.base04,
  ITEM_HINT_COLOR: rgba(theme.base0F, 90),
  TAB_BACK_SELECTED_COLOR: rgba(theme.base03, 20),
  TAB_BACK_COLOR: rgba(theme.base00, 70),
  TAB_BACK_HOVER_COLOR: rgba(theme.base03, 40),
  TAB_BORDER_COLOR: rgba(theme.base03, 50),
  DIFF_ADD_COLOR: rgba(theme.base0B, 40),
  DIFF_REMOVE_COLOR: rgba(theme.base08, 40),
  DIFF_ARROW_COLOR: theme.base0E,
  LINK_COLOR: rgba(theme.base0E, 90),
  LINK_HOVER_COLOR: theme.base0E,
  ERROR_COLOR: theme.base08,
});

type Color = keyof ReturnType<typeof colorMap>;
type ColorMap = {
  [color in Color]: string;
};

export const inspectorCss: Interpolation<Theme> = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
  fontSize: '12px',
  WebkitFontSmoothing: 'antialiased',
  lineHeight: '1.5em',

  backgroundColor: colorMap(theme).BACKGROUND_COLOR,
  color: colorMap(theme).TEXT_COLOR,
});

export const inspectorWideCss = css({ flexDirection: 'row' });

export const actionListCss: Interpolation<Theme> = (theme) => ({
  flexBasis: '40%',
  flexShrink: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  borderBottomWidth: '3px',
  borderBottomStyle: 'double',
  display: 'flex',
  flexDirection: 'column',

  backgroundColor: colorMap(theme).BACKGROUND_COLOR,
  borderColor: colorMap(theme).LIST_BORDER_COLOR,
});

export const actionListWideCss = css({
  flexBasis: '40%',
  borderBottom: 'none',
  borderRightWidth: '3px',
  borderRightStyle: 'double',
});

export const actionListHeaderCss: Interpolation<Theme> = (theme) => ({
  display: 'flex',
  flex: '0 0 auto',
  alignItems: 'center',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',

  borderColor: colorMap(theme).LIST_BORDER_COLOR,
});

export const actionListRowsCss = css({ overflow: 'auto' });

export const actionListHeaderSelectorCss = css({
  display: 'inline-flex',
  marginRight: '10px',
});

export const actionListItemCss: Interpolation<Theme> = (theme) => ({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '5px 10px',
  cursor: 'pointer',
  userSelect: 'none',

  borderBottomColor: colorMap(theme).BORDER_COLOR,
});

export const actionListItemSelectedCss: Interpolation<Theme> = (theme) => ({
  backgroundColor: colorMap(theme).SELECTED_BACKGROUND_COLOR,
});

export const actionListItemSkippedCss: Interpolation<Theme> = (theme) => ({
  backgroundColor: colorMap(theme).SKIPPED_BACKGROUND_COLOR,
});

export const actionListFromFutureCss = css({ opacity: '0.6' });

export const actionListItemButtonsCss = css({
  position: 'relative',
  height: '20px',
  display: 'flex',
});

export const actionListItemTimeCss: Interpolation<Theme> = (theme) => ({
  display: 'inline',
  padding: '4px 6px',
  borderRadius: '3px',
  fontSize: '0.8em',
  lineHeight: '1em',
  flexShrink: 0,

  backgroundColor: colorMap(theme).ACTION_TIME_BACK_COLOR,
  color: colorMap(theme).ACTION_TIME_COLOR,
});

export const actionListItemSelectorCss = css({ display: 'inline-flex' });

export const actionListItemNameCss = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '20px',
});

export const actionListItemNameSkippedCss = css({
  textDecoration: 'line-through',
  opacity: 0.3,
});

export const actionListHeaderSearchCss: Interpolation<Theme> = (theme) => ({
  outline: 'none',
  border: 'none',
  width: '100%',
  padding: '5px 10px',
  fontSize: '1em',
  fontFamily: 'monaco, Consolas, "Lucida Console", monospace',

  backgroundColor: colorMap(theme).BACKGROUND_COLOR,
  color: colorMap(theme).TEXT_COLOR,

  '&::-webkit-input-placeholder': {
    color: colorMap(theme).TEXT_PLACEHOLDER_COLOR,
  },

  '&::-moz-placeholder': {
    color: colorMap(theme).TEXT_PLACEHOLDER_COLOR,
  },
});

export const actionListHeaderWrapperCss = css({
  position: 'relative',
  height: '20px',
});

export const actionPreviewCss: Interpolation<Theme> = (theme) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'hidden',

  '& pre': {
    border: 'inherit',
    borderRadius: '3px',
    lineHeight: 'inherit',
    color: 'inherit',
  },

  backgroundColor: colorMap(theme).BACKGROUND_COLOR,
});

export const actionPreviewContentCss = css({ flex: 1, overflowY: 'auto' });

export const stateDiffEmptyCss: Interpolation<Theme> = (theme) => ({
  padding: '10px',

  color: colorMap(theme).TEXT_PLACEHOLDER_COLOR,
});

export const stateErrorCss: Interpolation<Theme> = (theme) => ({
  padding: '10px',
  marginLeft: '14px',
  fontWeight: 'bold',

  color: colorMap(theme).ERROR_COLOR,
});

export const inspectedPathCss = css({ padding: '6px 0' });

export const inspectedPathKeyCss = css({
  '&:not(:last-child):after': {
    content: '" > "',
  },
});

export const inspectedPathKeyLinkCss: Interpolation<Theme> = (theme) => ({
  cursor: 'pointer',
  color: colorMap(theme).LINK_COLOR,
  '&:hover': {
    textDecoration: 'underline',
    color: colorMap(theme).LINK_HOVER_COLOR,
  },
});

export const treeItemPinCss: Interpolation<Theme> = (theme) => ({
  fontSize: '0.7em',
  paddingLeft: '5px',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },

  color: colorMap(theme).PIN_COLOR,
});

export const treeItemHintCss: Interpolation<Theme> = (theme) => ({
  color: colorMap(theme).ITEM_HINT_COLOR,
});

export const previewHeaderCss: Interpolation<Theme> = (theme) => ({
  flex: '0 0 30px',
  padding: '5px 10px',
  alignItems: 'center',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',

  backgroundColor: colorMap(theme).HEADER_BACKGROUND_COLOR,
  borderBottomColor: colorMap(theme).HEADER_BORDER_COLOR,
});

export const tabSelectorCss = css({
  position: 'relative',
  display: 'inline-flex',
  float: 'right',
});

export const selectorButtonCss: Interpolation<Theme> = (theme) => ({
  cursor: 'pointer',
  position: 'relative',
  padding: '5px 10px',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderLeftWidth: 0,

  '&:first-child': {
    borderLeftWidth: '1px',
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
  },

  '&:last-child': {
    borderTopRightRadius: '3px',
    borderBottomRightRadius: '3px',
  },

  backgroundColor: colorMap(theme).TAB_BACK_COLOR,

  '&:hover': {
    backgroundColor: colorMap(theme).TAB_BACK_HOVER_COLOR,
  },

  borderColor: colorMap(theme).TAB_BORDER_COLOR,
});

export const selectorButtonSmallCss = css({
  padding: '0px 8px',
  fontSize: '0.8em',
});

export const selectorButtonSelectedCss: Interpolation<Theme> = (theme) => ({
  backgroundColor: colorMap(theme).TAB_BACK_SELECTED_COLOR,
});

export const diffCss: Interpolation<Theme> = (theme) => ({
  padding: '2px 3px',
  borderRadius: '3px',
  position: 'relative',

  color: colorMap(theme).TEXT_COLOR,
});

export const diffWrapCss = css({ position: 'relative', zIndex: 1 });

export const diffAddCss: Interpolation<Theme> = (theme) => ({
  backgroundColor: colorMap(theme).DIFF_ADD_COLOR,
});

export const diffRemoveCss: Interpolation<Theme> = (theme) => ({
  textDecoration: 'line-through',
  backgroundColor: colorMap(theme).DIFF_REMOVE_COLOR,
});

export const diffUpdateFromCss: Interpolation<Theme> = (theme) => ({
  textDecoration: 'line-through',
  backgroundColor: colorMap(theme).DIFF_REMOVE_COLOR,
});

export const diffUpdateToCss: Interpolation<Theme> = (theme) => ({
  backgroundColor: colorMap(theme).DIFF_ADD_COLOR,
});

export const diffUpdateArrowCss: Interpolation<Theme> = (theme) => ({
  color: colorMap(theme).DIFF_ARROW_COLOR,
});

export const rightSliderCss = css({
  WebkitFontSmoothing: 'subpixel-antialiased', // http://stackoverflow.com/a/21136111/4218591
  position: 'absolute',
  right: 0,
  transform: 'translateX(150%)',
  transition: 'transform 0.2s ease-in-out',
});

export const rightSliderRotateCss = css({
  transform: 'rotateX(90deg)',
  transition: 'transform 0.2s ease-in-out 0.08s',
});

export const rightSliderShownCss = css({
  position: 'static',
  transform: 'translateX(0)',
});

export const rightSliderRotateShownCss = css({
  transform: 'rotateX(0)',
  transition: 'transform 0.2s ease-in-out 0.18s',
});

const getSheetFromColorMap = (map: ColorMap) => ({});

let themeSheet: StyleSheet;

const getDefaultThemeStyling = (theme: Base16Theme) => {
  if (themeSheet) {
    themeSheet.detach();
  }

  themeSheet = jss
    .createStyleSheet(getSheetFromColorMap(colorMap(theme)))
    .attach();

  return themeSheet.classes;
};

export const base16Themes = { ...reduxThemes, ...inspectorThemes };

export const createStylingFromTheme: CurriedFunction1<
  Base16StylingTheme | undefined,
  StylingFunction
> = createStyling(getDefaultThemeStyling, {
  defaultBase16: inspector,
  base16Themes,
});
