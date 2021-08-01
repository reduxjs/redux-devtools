import jss, { StyleSheet } from 'jss';
import preset from 'jss-preset-default';
import {
  createStyling,
  getBase16Theme,
  invertTheme,
  StylingConfig,
} from 'react-base16-styling';
import rgba from 'hex-rgba';
import * as reduxThemes from 'redux-devtools-themes';
import { Action } from 'redux';
import { RtkQueryMonitorProps, StyleUtils } from '../types';
import { createContext } from 'react';

jss.setup(preset());

export const colorMap = (theme: reduxThemes.Base16Theme) =>
  ({
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
    ULIST_DISC_COLOR: theme.base0D,
    ULIST_COLOR: rgba(theme.base06, 60),
    ULIST_STRONG_COLOR: theme.base0B,
    TAB_CONTENT_COLOR: rgba(theme.base06, 60),
    TOGGLE_BUTTON_BACKGROUND: rgba(theme.base00, 70),
    TOGGLE_BUTTON_SELECTED_BACKGROUND: theme.base04,
    TOGGLE_BUTTON_ERROR: rgba(theme.base08, 40),
  } as const);

type Color = keyof ReturnType<typeof colorMap>;
type ColorMap = {
  [color in Color]: string;
};

const getSheetFromColorMap = (map: ColorMap) => {
  const appearanceNone = {
    '-webkit-appearance': 'none',
  };

  return {
    inspector: {
      display: 'flex',
      flexFlow: 'column nowrap',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      'font-family': 'monaco, Consolas, "Lucida Console", monospace',
      'font-size': '12px',
      'font-smoothing': 'antialiased',
      'line-height': '1.5em',

      'background-color': map.BACKGROUND_COLOR,
      color: map.TEXT_COLOR,

      '&[data-wide-layout="1"]': {
        flexFlow: 'row nowrap',
      },
    },

    querySectionWrapper: {
      display: 'flex',
      flex: '0 0 auto',
      height: '50%',
      width: '100%',
      borderColor: map.TAB_BORDER_COLOR,

      '&[data-wide-layout="0"]': {
        borderBottomWidth: 1,
        borderStyle: 'solid',
      },

      '&[data-wide-layout="1"]': {
        height: '100%',
        width: '44%',
        borderRightWidth: 1,
        borderStyle: 'solid',
      },
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
      '&:last-child': {
        'border-bottom-width': 0,
      },
      overflow: 'hidden',
      maxHeight: 47,
      'border-bottom-color': map.BORDER_COLOR,
    },

    queryListItemKey: {
      display: '-webkit-box',
      boxOrient: 'vertical',
      '-webkit-line-clamp': 2,
      whiteSpace: 'normal',
      overflow: 'hidden',
      width: '100%',
      maxWidth: 'calc(100% - 70px)',
      wordBreak: 'break-all',
      margin: 0,
    },

    queryListHeader: {
      display: 'flex',
      padding: 4,
      flex: '0 0 auto',
      'align-items': 'center',
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',

      'border-color': map.LIST_BORDER_COLOR,
    },

    queryStatusWrapper: {
      display: 'flex',
      width: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      flex: '0 0 auto',
      overflow: 'hidden',
    },

    queryType: {
      marginRight: 4,
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
      fontWeight: 700,
      'background-color': map.ACTION_TIME_BACK_COLOR,
      color: map.ACTION_TIME_COLOR,
    },

    queryListItemSelected: {
      'background-color': map.SELECTED_BACKGROUND_COLOR,
    },

    tabSelector: {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      '& > *': {
        flex: '0 1 auto',
      },
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
      height: '33px',
      padding: '0 8px',
      display: 'inline-flex',
      alignItems: 'center',
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

      '& > *': {
        display: '-webkit-box',
        boxOrient: 'vertical',
        '-webkit-line-clamp': 1,
        overflow: 'hidden',
        wordBreak: 'break-all',
        '-webkit-box-pack': 'end',
        paddingBottom: 0,
      },
    },

    selectorButtonSmall: {
      padding: '0px 8px',
      'font-size': '0.8em',
    },

    selectorButtonSelected: {
      'background-color': map.TAB_BACK_SELECTED_COLOR,
    },

    sortButton: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexFlow: 'row nowrap',
      cursor: 'pointer',
      position: 'relative',
      padding: '0 8px',
      color: map.TEXT_COLOR,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '3px',
      backgroundColor: map.TAB_BACK_COLOR,
      borderColor: map.TAB_BORDER_COLOR,
      height: 30,
      fontSize: 12,
      width: 64,

      '&:active': {
        backgroundColor: map.TAB_BACK_SELECTED_COLOR,
      },
    },

    toggleButton: {
      width: '24px',
      height: '24px',
      display: 'inline-block',
      flex: '0 0 auto',
      color: map.TEXT_PLACEHOLDER_COLOR,
      cursor: 'pointer',
      padding: 0,
      fontSize: '0.7em',
      letterSpacing: '-0.7px',
      outline: 'none',
      boxShadow: 'none',
      fontWeight: '700',
      border: 'none',

      '&:hover': {
        color: map.TEXT_COLOR,
      },

      backgroundColor: 'transparent',
      '&[aria-pressed="true"]': {
        color: map.BACKGROUND_COLOR,
        backgroundColor: map.TEXT_COLOR,
      },

      '&[data-type="error"]': {
        color: map.TEXT_COLOR,
        backgroundColor: map.TOGGLE_BUTTON_ERROR,
      },
    },

    queryForm: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    sortBySection: {
      display: 'flex',
      padding: '0.4em',
      '& label': {
        display: 'flex',
        flex: '0 0 auto',
        whiteSpace: 'noWrap',
        alignItems: 'center',
        paddingRight: '0.4em',
      },

      '& > :last-child': {
        flex: '0 0 auto',
        marginLeft: '0.4em',
      },
    },

    querySearch: {
      maxWidth: '65%',
      'background-color': map.BACKGROUND_COLOR,
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'row nowrap',
      flex: '1 1 auto',
      paddingRight: 6,
      '& input': {
        outline: 'none',
        border: 'none',
        width: '100%',
        flex: '1 1 auto',
        padding: '5px 10px',
        'font-size': '1em',
        position: 'relative',
        fontFamily: 'monaco, Consolas, "Lucida Console", monospace',

        'background-color': map.BACKGROUND_COLOR,
        color: map.TEXT_COLOR,

        '&::-webkit-input-placeholder': {
          color: map.TEXT_PLACEHOLDER_COLOR,
        },

        '&::-moz-placeholder': {
          color: map.TEXT_PLACEHOLDER_COLOR,
        },
        '&::-webkit-search-cancel-button': appearanceNone,
      },
    },

    closeButton: {
      ...appearanceNone,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      display: 'block',
      flex: '0 0 auto',
      cursor: 'pointer',
      background: 'transparent',
      position: 'relative',
      fontSize: 'inherit',
      '&[data-invisible="1"]': {
        visibility: 'hidden !important',
      },
      '&::after': {
        content: '"\u00d7"',
        display: 'block',
        padding: 4,
        fontSize: '1.2em',
        color: map.TEXT_PLACEHOLDER_COLOR,
        background: 'transparent',
      },
      '&:hover::after': {
        color: map.TEXT_COLOR,
      },
    },

    noApiFound: {
      width: '100%',
      textAlign: 'center',
      color: map.TEXT_COLOR,
      padding: '1.4em',
      '& a': {
        fontSize: 'inherit',
        color: map.TEXT_COLOR,
        textDecoration: 'underline',
      },
    },

    searchSelectLabel: {
      display: 'inline-block',
      padding: 4,
      borderLeft: '1px solid currentColor',
    },

    queryPreview: {
      flex: '1 1 50%',
      overflowX: 'hidden',
      oveflowY: 'auto',
      display: 'flex',
      'flex-direction': 'column',
      'overflow-y': 'hidden',
      '& pre': {
        border: 'inherit',
        'border-radius': '3px',
        'line-height': 'inherit',
        color: 'inherit',
      },

      'background-color': map.BACKGROUND_COLOR,
    },

    previewHeader: {
      flex: '0 0 30px',
      padding: '5px 4px',
      'align-items': 'center',
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',

      'background-color': map.HEADER_BACKGROUND_COLOR,
      'border-bottom-color': map.HEADER_BORDER_COLOR,
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

    treeItemKey: {
      color: map.TEXT_PLACEHOLDER_COLOR,
    },

    treeWrapper: {
      overflowX: 'auto',
      overflowY: 'auto',
      padding: '0.5em 1em',
    },

    tabContent: {
      display: 'block',
      overflowY: 'auto',
      padding: '0.5em 0',
      color: map.TAB_CONTENT_COLOR,
      '& h2': {
        color: map.ULIST_STRONG_COLOR,
        padding: '0.5em 1em',
        fontWeight: 700,
      },
      '& h3': {
        color: map.ULIST_STRONG_COLOR,
      },
    },

    uList: {
      listStyle: 'none',
      padding: '0 0 0 1em',
      color: map.ULIST_COLOR,
      '& > li': {
        listStyle: 'none',
      },
      '& > li::before': {
        content: '"\\2022"',
        display: 'inline-block',
        paddingRight: '0.5em',
        color: map.ULIST_DISC_COLOR,
        fontSize: '0.8em',
      },

      '& strong': {
        color: map.ULIST_STRONG_COLOR,
      },
    },
  };
};

let themeSheet: StyleSheet;

const getDefaultThemeStyling = (theme: reduxThemes.Base16Theme) => {
  if (themeSheet) {
    themeSheet.detach();
  }

  themeSheet = jss
    .createStyleSheet(getSheetFromColorMap(colorMap(theme)))
    .attach();

  return themeSheet.classes;
};

export const createStylingFromTheme = createStyling(getDefaultThemeStyling, {
  defaultBase16: reduxThemes.nicinabox,
  base16Themes: { ...reduxThemes },
});

export function createThemeState<S, A extends Action<unknown>>(
  props: RtkQueryMonitorProps<S, A>
): StyleUtils {
  const base16Theme =
    getBase16Theme(props.theme, { ...reduxThemes }) ?? reduxThemes.nicinabox;

  const theme = props.invertTheme ? invertTheme(props.theme) : props.theme;
  const styling = createStylingFromTheme(theme);

  return { base16Theme, styling, invertTheme: !!props.invertTheme };
}

const mockStyling = () => ({ className: '', style: {} });

export const StyleUtilsContext = createContext<StyleUtils>({
  base16Theme: reduxThemes.nicinabox,
  invertTheme: false,
  styling: mockStyling,
});

export function getJsonTreeTheme(
  base16Theme: reduxThemes.Base16Theme
): StylingConfig {
  return {
    extend: base16Theme,
    nestedNode: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        whiteSpace: expanded ? 'inherit' : 'nowrap',
      },
    }),
    nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        display: expanded ? 'none' : 'inline',
      },
    }),
  };
}
