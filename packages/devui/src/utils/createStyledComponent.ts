import styled, {
  Interpolation,
  InterpolationFunction,
  InterpolationValue,
  StyledComponentClass,
  ThemedStyledFunction,
  ThemedStyledProps
} from 'styled-components';
import getDefaultTheme from '../themes/default';
import { Base16Theme } from 'base16';
import { Theme } from '../themes/default';
import * as React from 'react';
import { ThemeFromProvider } from './theme';

function isObject<P>(
  styles:
    | {
        [type: string]: Interpolation<ThemedStyledProps<P, Theme>>;
        default: Interpolation<ThemedStyledProps<P, Theme>>;
      }
    | Interpolation<ThemedStyledProps<P, Theme>>
): styles is {
  [type: string]: InterpolationFunction<ThemedStyledProps<P, Theme>>;
  default: InterpolationFunction<ThemedStyledProps<P, Theme>>;
} {
  return typeof styles === 'object';
}

const getStyle = <P>(
  styles:
    | {
        [type: string]: InterpolationFunction<ThemedStyledProps<P, Theme>>;
        default: InterpolationFunction<ThemedStyledProps<P, Theme>>;
      }
    | InterpolationFunction<ThemedStyledProps<P, Theme>>,
  type: string
) => (isObject(styles) ? styles[type] || styles.default : styles);

function isThemeFromProvider(
  theme: Theme | Base16Theme
): theme is ThemeFromProvider {
  return (theme as ThemeFromProvider).type !== undefined;
}

function createStyledComponent<P, TTag extends keyof JSX.IntrinsicElements>(
  styles:
    | {
        [type: string]: InterpolationFunction<ThemedStyledProps<P, Theme>>;
        default: InterpolationFunction<ThemedStyledProps<P, Theme>>;
      }
    | InterpolationFunction<ThemedStyledProps<P, Theme>>,
  component?: TTag
): StyledComponentClass<P, Theme, P & JSX.IntrinsicElements[TTag]>;
function createStyledComponent<P>(
  styles:
    | {
        [type: string]: InterpolationFunction<ThemedStyledProps<P, Theme>>;
        default: InterpolationFunction<ThemedStyledProps<P, Theme>>;
      }
    | InterpolationFunction<ThemedStyledProps<P, Theme>>,
  component?: React.ComponentClass<P>
): StyledComponentClass<P, Theme>;
function createStyledComponent<P, TTag extends keyof JSX.IntrinsicElements>(
  styles:
    | {
        [type: string]: InterpolationFunction<ThemedStyledProps<P, Theme>>;
        default: InterpolationFunction<ThemedStyledProps<P, Theme>>;
      }
    | InterpolationFunction<ThemedStyledProps<P, Theme>>,
  component?: TTag | React.ComponentClass<P>
): StyledComponentClass<P, Theme> {
  return (styled((component || 'div') as TTag) as ThemedStyledFunction<
    P,
    Theme
  >)`
    ${(props: ThemedStyledProps<P, Theme>) =>
      isThemeFromProvider(props.theme)
        ? getStyle(styles, props.theme.type)
        : // used outside of container (theme provider)
          getStyle(
            styles,
            'default'
          )({
            ...props,
            theme: getDefaultTheme(props.theme)
          })}
  `;
}

export default createStyledComponent;

// TODO: memoize it?
