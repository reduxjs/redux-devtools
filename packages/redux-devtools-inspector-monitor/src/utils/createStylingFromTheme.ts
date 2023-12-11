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

const getSheetFromColorMap = (map: ColorMap) => ({
  actionListItemName: {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'line-height': '20px',
  },

  actionListItemNameSkipped: {
    'text-decoration': 'line-through',
    opacity: 0.3,
  },

  actionListHeaderSearch: {
    outline: 'none',
    border: 'none',
    width: '100%',
    padding: '5px 10px',
    'font-size': '1em',
    'font-family': 'monaco, Consolas, "Lucida Console", monospace',

    'background-color': map.BACKGROUND_COLOR,
    color: map.TEXT_COLOR,

    '&::-webkit-input-placeholder': {
      color: map.TEXT_PLACEHOLDER_COLOR,
    },

    '&::-moz-placeholder': {
      color: map.TEXT_PLACEHOLDER_COLOR,
    },
  },

  actionListHeaderWrapper: {
    position: 'relative',
    height: '20px',
  },

  actionPreview: {
    flex: 1,
    display: 'flex',
    'flex-direction': 'column',
    'flex-grow': 1,
    'overflow-y': 'hidden',

    '& pre': {
      border: 'inherit',
      'border-radius': '3px',
      'line-height': 'inherit',
      color: 'inherit',
    },

    'background-color': map.BACKGROUND_COLOR,
  },

  actionPreviewContent: {
    flex: 1,
    'overflow-y': 'auto',
  },

  stateDiff: {
    padding: '5px 0',
  },

  stateDiffEmpty: {
    padding: '10px',

    color: map.TEXT_PLACEHOLDER_COLOR,
  },

  stateError: {
    padding: '10px',
    'margin-left': '14px',
    'font-weight': 'bold',

    color: map.ERROR_COLOR,
  },

  inspectedPath: {
    padding: '6px 0',
  },

  inspectedPathKey: {
    '&:not(:last-child):after': {
      content: '" > "',
    },
  },

  inspectedPathKeyLink: {
    cursor: 'pointer',
    color: map.LINK_COLOR,
    '&:hover': {
      'text-decoration': 'underline',
      color: map.LINK_HOVER_COLOR,
    },
  },

  treeItemPin: {
    'font-size': '0.7em',
    'padding-left': '5px',
    cursor: 'pointer',
    '&:hover': {
      'text-decoration': 'underline',
    },

    color: map.PIN_COLOR,
  },

  treeItemHint: {
    color: map.ITEM_HINT_COLOR,
  },

  previewHeader: {
    flex: '0 0 30px',
    padding: '5px 10px',
    'align-items': 'center',
    'border-bottom-width': '1px',
    'border-bottom-style': 'solid',

    'background-color': map.HEADER_BACKGROUND_COLOR,
    'border-bottom-color': map.HEADER_BORDER_COLOR,
  },

  tabSelector: {
    position: 'relative',
    display: 'inline-flex',
    float: 'right',
  },

  selectorButton: {
    cursor: 'pointer',
    position: 'relative',
    padding: '5px 10px',
    'border-style': 'solid',
    'border-width': '1px',
    'border-left-width': 0,

    '&:first-child': {
      'border-left-width': '1px',
      'border-top-left-radius': '3px',
      'border-bottom-left-radius': '3px',
    },

    '&:last-child': {
      'border-top-right-radius': '3px',
      'border-bottom-right-radius': '3px',
    },

    'background-color': map.TAB_BACK_COLOR,

    '&:hover': {
      'background-color': map.TAB_BACK_HOVER_COLOR,
    },

    'border-color': map.TAB_BORDER_COLOR,
  },

  selectorButtonSmall: {
    padding: '0px 8px',
    'font-size': '0.8em',
  },

  selectorButtonSelected: {
    'background-color': map.TAB_BACK_SELECTED_COLOR,
  },

  diff: {
    padding: '2px 3px',
    'border-radius': '3px',
    position: 'relative',

    color: map.TEXT_COLOR,
  },

  diffWrap: {
    position: 'relative',
    'z-index': 1,
  },

  diffAdd: {
    'background-color': map.DIFF_ADD_COLOR,
  },

  diffRemove: {
    'text-decoration': 'line-through',
    'background-color': map.DIFF_REMOVE_COLOR,
  },

  diffUpdateFrom: {
    'text-decoration': 'line-through',
    'background-color': map.DIFF_REMOVE_COLOR,
  },

  diffUpdateTo: {
    'background-color': map.DIFF_ADD_COLOR,
  },

  diffUpdateArrow: {
    color: map.DIFF_ARROW_COLOR,
  },

  rightSlider: {
    'font-smoothing': 'subpixel-antialiased', // http://stackoverflow.com/a/21136111/4218591
    position: 'absolute',
    right: 0,
    transform: 'translateX(150%)',
    transition: 'transform 0.2s ease-in-out',
  },

  rightSliderRotate: {
    transform: 'rotateX(90deg)',
    transition: 'transform 0.2s ease-in-out 0.08s',
  },

  rightSliderShown: {
    position: 'static',
    transform: 'translateX(0)',
  },

  rightSliderRotateShown: {
    transform: 'rotateX(0)',
    transition: 'transform 0.2s ease-in-out 0.18s',
  },
});

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
