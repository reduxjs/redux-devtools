import React from 'react';
import styled, {
  FunctionInterpolation,
  StyledComponent,
} from '@emotion/styled';
import { PropsOf } from '@emotion/react';
import type { Base16Theme } from 'react-base16-styling';
import getDefaultTheme, { Theme } from '../themes/default';
import { ThemeFromProvider } from './theme';

type StyleFunction<Props> = FunctionInterpolation<Props>;

interface StylesObject<Props> {
  [type: string]: StyleFunction<Props>;
}

type Styles<Props> = StylesObject<Props> | StyleFunction<Props>;

function isStylesObject<Props>(
  styles: Styles<Props>,
): styles is StylesObject<Props> {
  return typeof styles === 'object';
}

const getStyle = <Props>(styles: Styles<Props>, type: string) =>
  isStylesObject(styles) ? styles[type] || styles.default : styles;

function isThemeFromProvider(
  theme: Theme | Base16Theme,
): theme is ThemeFromProvider {
  return (theme as ThemeFromProvider).type !== undefined;
}

export default function createStyledComponent<
  C extends keyof React.JSX.IntrinsicElements | React.ComponentType<any>,
  O extends object,
>(
  styles: Styles<PropsOf<C> & O & { theme: Theme }>,
  component?: C,
): StyledComponent<PropsOf<C> & O & { theme?: Theme | Base16Theme }> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return styled((component || 'div') as C)`
    ${(props: PropsOf<C> & { theme: Theme | Base16Theme }) =>
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
  ` as StyledComponent<PropsOf<C> & O & { theme?: Theme | Base16Theme }>;
}

// TODO: memoize it?
