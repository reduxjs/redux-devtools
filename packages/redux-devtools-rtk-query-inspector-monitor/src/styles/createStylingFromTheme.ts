import jss, { StyleSheet } from 'jss';
import preset from 'jss-preset-default';
import {
  createStyling,
  getBase16Theme,
  invertTheme,
  StylingFunction,
} from 'react-base16-styling';
import rgba from 'hex-rgba';
import { Base16Theme } from 'redux-devtools-themes';
import { rtkInspectorTheme } from './theme';
import * as reduxThemes from 'redux-devtools-themes';
import { Action } from 'redux';
import { RtkQueryInspectorMonitorProps } from '../types';
import { createContext } from 'react';

jss.setup(preset());

export const colorMap = (theme: Base16Theme) => ({
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

const getSheetFromColorMap = (map: ColorMap) => ({
  inspector: {
    display: 'flex',
    'flex-direction': 'column',
    width: '100%',
    height: '100%',
    'font-family': 'monaco, Consolas, "Lucida Console", monospace',
    'font-size': '12px',
    'font-smoothing': 'antialiased',
    'line-height': '1.5em',

    'background-color': map.BACKGROUND_COLOR,
    color: map.TEXT_COLOR,
  },

  querySectionWrapper: {
    display: 'flex',
    height: '100%',
    flexFlow: 'column nowrap',
    '& > :first-child': {
      flex: '0 0 auto',
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',
      'border-color': map.LIST_BORDER_COLOR,
    },
    '& > :nth-child(n + 2)': {
      flex: '1 1 auto',
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: 'calc(100% - 70px)',
    },
  },

  queryList: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },

  queryListItem: {
    'border-bottom-width': '1px',
    'border-bottom-style': 'solid',
    display: 'flex',
    'justify-content': 'space-between',
    padding: '5px 10px',
    cursor: 'pointer',
    'user-select': 'none',

    '& > :first-child': {
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
      maxWidth: 'calc(100% - 70px)',
      textOverflow: 'ellipsis',
    },
    '&:last-child': {
      'border-bottom-width': 0,
    },

    'border-bottom-color': map.BORDER_COLOR,
  },

  queryListHeader: {
    display: 'flex',
    flex: '0 0 auto',
    'align-items': 'center',
    'border-bottom-width': '1px',
    'border-bottom-style': 'solid',

    'border-color': map.LIST_BORDER_COLOR,
  },

  queryStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    padding: '0 6px',
    'border-radius': '3px',
    'font-size': '0.7em',
    'line-height': '1em',
    'flex-shrink': 0,
    'background-color': map.ACTION_TIME_BACK_COLOR,
    color: map.ACTION_TIME_COLOR,
  },

  queryListItemSelected: {
    'background-color': map.SELECTED_BACKGROUND_COLOR,
  },

  tabSelector: {
    position: 'relative',
    'z-index': 1,
    display: 'inline-flex',
    float: 'right',
  },

  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
  },

  selectorButton: {
    cursor: 'pointer',
    position: 'relative',
    padding: '6.5px 10px',
    color: map.TEXT_COLOR,
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

  queryForm: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  sortBySection: {
    display: 'flex',
    padding: '0.4em',
    '& > [role="radiogroup"]': {
      flex: '0 0 auto',
      padding: '0 0 0 0.4em',
    },
    '& label': {
      display: 'flex',
      flex: '0 0 auto',
      whiteSpace: 'noWrap',
      alignItems: 'center',
      paddingRight: '0.4em',
    },
  },
  querySearch: {
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

export const base16Themes = { ...reduxThemes };

export const createStylingFromTheme = createStyling(getDefaultThemeStyling, {
  defaultBase16: rtkInspectorTheme,
  base16Themes,
});

export interface StyleUtils {
  base16Theme: Base16Theme;
  styling: StylingFunction;
}

export function createThemeState<S, A extends Action<unknown>>(
  props: RtkQueryInspectorMonitorProps<S, A>
): StyleUtils {
  const base16Theme =
    getBase16Theme(props.theme, base16Themes) ?? rtkInspectorTheme;

  const theme = props.invertTheme ? invertTheme(props.theme) : props.theme;
  const styling = createStylingFromTheme(theme);

  return { base16Theme, styling };
}

export const StyleUtilsContext = createContext<StyleUtils>({
  base16Theme: rtkInspectorTheme,
  styling: (...args: any[]) => ({ className: '', style: {} }),
});
