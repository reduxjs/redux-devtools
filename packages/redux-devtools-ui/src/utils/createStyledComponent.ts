import React from 'react';
import styled, {
  InterpolationFunction,
  StyledComponent,
  StyledComponentPropsWithRef,
  ThemedStyledInterface,
  ThemedStyledProps,
} from 'styled-components';
import type { Base16Theme } from 'react-base16-styling';
import getDefaultTheme, { Theme } from '../themes/default';
import { ThemeFromProvider } from './theme';

type StyleFunction<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
> = InterpolationFunction<
  ThemedStyledProps<StyledComponentPropsWithRef<C> & O, Theme>
>;

interface StylesObject<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
> {
  [type: string]: StyleFunction<C, O>;
}

type Styles<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
> = StylesObject<C, O> | StyleFunction<C, O>;

function isStylesObject<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
>(styles: Styles<C>): styles is StylesObject<C, O> {
  return typeof styles === 'object';
}

const getStyle = <
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
>(
  styles: Styles<C, O>,
  type: string,
) => (isStylesObject(styles) ? styles[type] || styles.default : styles);

function isThemeFromProvider(
  theme: Theme | Base16Theme,
): theme is ThemeFromProvider {
  return (theme as ThemeFromProvider).type !== undefined;
}

export default function createStyledComponent<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
>(
  styles: Styles<C, O>,
  component?: C,
): StyledComponent<C, Theme | Base16Theme, O> {
  return (styled as ThemedStyledInterface<Theme>)((component || 'div') as C)`
    ${(props: ThemedStyledProps<StyledComponentPropsWithRef<C> & O, Theme>) =>
      isThemeFromProvider(props.theme as Theme | Base16Theme)
        ? getStyle(styles, props.theme.type as string)
        : // used outside of container (theme provider)
          getStyle(
            styles,
            'default',
          )({
            ...props,
            theme: getDefaultTheme(props.theme as Base16Theme),
          })}
  ` as StyledComponent<C, Theme | Base16Theme, O>;
}

// TODO: memoize it?
