import type { CurriedFunction1 } from 'lodash';
import {
  Base16Theme,
  createStyling,
  StylingConfig,
} from 'react-base16-styling';
import solarized from './themes/solarized';
import { StylingFunction, Theme } from 'react-base16-styling/src';

const colorMap = (theme: Base16Theme) => ({
  BACKGROUND_COLOR: theme.base00,
  TEXT_COLOR: theme.base07,
  STRING_COLOR: theme.base0B,
  DATE_COLOR: theme.base0B,
  NUMBER_COLOR: theme.base09,
  BOOLEAN_COLOR: theme.base09,
  NULL_COLOR: theme.base08,
  UNDEFINED_COLOR: theme.base08,
  FUNCTION_COLOR: theme.base08,
  SYMBOL_COLOR: theme.base08,
  LABEL_COLOR: theme.base0D,
  ARROW_COLOR: theme.base0D,
  ITEM_STRING_COLOR: theme.base0B,
  ITEM_STRING_EXPANDED_COLOR: theme.base03,
});

type Color = keyof ReturnType<typeof colorMap>;
type Colors = {
  [color in Color]: string;
};

const valueColorMap = (colors: Colors) => ({
  String: colors.STRING_COLOR,
  Date: colors.DATE_COLOR,
  Number: colors.NUMBER_COLOR,
  Boolean: colors.BOOLEAN_COLOR,
  Null: colors.NULL_COLOR,
  Undefined: colors.UNDEFINED_COLOR,
  Function: colors.FUNCTION_COLOR,
  Symbol: colors.SYMBOL_COLOR,
});

const getDefaultThemeStyling = (theme: Base16Theme): StylingConfig => {
  const colors = colorMap(theme);

  return {
    tree: {
      border: 0,
      padding: 0,
      marginTop: '0.5em',
      marginBottom: '0.5em',
      marginLeft: '0.125em',
      marginRight: 0,
      listStyle: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      backgroundColor: colors.BACKGROUND_COLOR,
    },

    value: ({ style }, nodeType, keyPath) => ({
      style: {
        ...style,
        paddingTop: '0.25em',
        paddingRight: 0,
        marginLeft: '0.875em',
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        wordWrap: 'break-word',
        paddingLeft: (keyPath as unknown[]).length > 1 ? '2.125em' : '1.25em',
        textIndent: '-0.5em',
        wordBreak: 'break-all',
      },
    }),

    label: {
      display: 'inline-block',
      color: colors.LABEL_COLOR,
    },

    valueLabel: {
      margin: '0 0.5em 0 0',
    },

    valueText: ({ style }, nodeType) => ({
      style: {
        ...style,
        color:
          valueColorMap(colors)[
            nodeType as keyof ReturnType<typeof valueColorMap>
          ],
      },
    }),

    itemRange: (styling, expanded) => ({
      style: {
        paddingTop: expanded ? 0 : '0.25em',
        cursor: 'pointer',
        color: colors.LABEL_COLOR,
      },
    }),

    arrow: ({ style }, nodeType, expanded) => ({
      style: {
        ...style,
        marginLeft: 0,
        transition: '150ms',
        WebkitTransition: '150ms',
        MozTransition: '150ms',
        WebkitTransform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
        MozTransform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
        transform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
        transformOrigin: '45% 50%',
        WebkitTransformOrigin: '45% 50%',
        MozTransformOrigin: '45% 50%',
        position: 'relative',
        lineHeight: '1.1em',
        fontSize: '0.75em',
      },
    }),

    arrowContainer: ({ style }, arrowStyle) => ({
      style: {
        ...style,
        display: 'inline-block',
        paddingRight: '0.5em',
        paddingLeft: arrowStyle === 'double' ? '1em' : 0,
        cursor: 'pointer',
      },
    }),

    arrowSign: {
      color: colors.ARROW_COLOR,
    },

    arrowSignInner: {
      position: 'absolute',
      top: 0,
      left: '-0.4em',
    },

    nestedNode: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        ...style,
        position: 'relative',
        paddingTop: '0.25em',
        marginLeft: (keyPath as unknown[]).length > 1 ? '0.875em' : 0,
        paddingLeft: !expandable ? '1.125em' : 0,
      },
    }),

    rootNode: {
      padding: 0,
      margin: 0,
    },

    nestedNodeLabel: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        ...style,
        margin: 0,
        padding: 0,
        WebkitUserSelect: expandable ? 'inherit' : 'text',
        MozUserSelect: expandable ? 'inherit' : 'text',
        cursor: expandable ? 'pointer' : 'default',
      },
    }),

    nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        paddingLeft: '0.5em',
        cursor: 'default',
        color: expanded
          ? colors.ITEM_STRING_EXPANDED_COLOR
          : colors.ITEM_STRING_COLOR,
      },
    }),

    nestedNodeItemType: {
      marginLeft: '0.3em',
      marginRight: '0.3em',
    },

    nestedNodeChildren: ({ style }, nodeType, expanded) => ({
      style: {
        ...style,
        padding: 0,
        margin: 0,
        listStyle: 'none',
        display: expanded ? 'block' : 'none',
      },
    }),

    rootNodeChildren: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
    },
  };
};

const createStylingFromTheme: CurriedFunction1<
  Theme | undefined,
  StylingFunction
> = createStyling(getDefaultThemeStyling, {
  defaultBase16: solarized,
});

export default createStylingFromTheme;
