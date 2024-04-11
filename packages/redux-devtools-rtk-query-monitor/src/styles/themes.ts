import {
  base16Themes,
  getBase16Theme,
  invertBase16Theme,
} from 'react-base16-styling';
import type { Base16Theme, StylingConfig } from 'react-base16-styling';
import rgba from 'hex-rgba';
import { createContext } from 'react';
import { StyleUtils } from '../types';

export function resolveBase16Theme(
  theme: keyof typeof base16Themes | Base16Theme,
) {
  return getBase16Theme(theme, base16Themes) ?? base16Themes.nicinabox;
}

/**
 * @internal
 */
declare module '@emotion/react' {
  export interface Theme {
    TEXT_COLOR: string;
    TEXT_PLACEHOLDER_COLOR: string;
    BACKGROUND_COLOR: string;
    SELECTED_BACKGROUND_COLOR: string;
    SKIPPED_BACKGROUND_COLOR: string;
    HEADER_BACKGROUND_COLOR: string;
    HEADER_BORDER_COLOR: string;
    BORDER_COLOR: string;
    LIST_BORDER_COLOR: string;
    ACTION_TIME_BACK_COLOR: string;
    ACTION_TIME_COLOR: string;
    PIN_COLOR: string;
    ITEM_HINT_COLOR: string;
    TAB_BACK_SELECTED_COLOR: string;
    TAB_BACK_COLOR: string;
    TAB_BACK_HOVER_COLOR: string;
    TAB_BORDER_COLOR: string;
    DIFF_ADD_COLOR: string;
    DIFF_REMOVE_COLOR: string;
    DIFF_ARROW_COLOR: string;
    LINK_COLOR: string;
    LINK_HOVER_COLOR: string;
    ERROR_COLOR: string;
    ULIST_DISC_COLOR: string;
    ULIST_COLOR: string;
    ULIST_STRONG_COLOR: string;
    TAB_CONTENT_COLOR: string;
    TOGGLE_BUTTON_BACKGROUND: string;
    TOGGLE_BUTTON_SELECTED_BACKGROUND: string;
    TOGGLE_BUTTON_ERROR: string;
  }
}

export const colorMap = (theme: Base16Theme) =>
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
  }) as const;

export function createRtkQueryMonitorThemeFromBase16Theme(
  base16Theme: Base16Theme,
  invertTheme: boolean,
) {
  const finalBase16Theme = invertTheme
    ? invertBase16Theme(base16Theme)
    : base16Theme;
  return colorMap(finalBase16Theme);
}

export const StyleUtilsContext = createContext<StyleUtils>({
  base16Theme: base16Themes.nicinabox,
  invertTheme: false,
});

export function getJsonTreeTheme(base16Theme: Base16Theme): StylingConfig {
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
