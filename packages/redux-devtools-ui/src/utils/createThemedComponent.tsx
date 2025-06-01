import React from 'react';
import { withTheme } from '@emotion/react';
import type { Base16Theme } from 'react-base16-styling';
import getDefaultTheme, { Theme } from '../themes/default.js';

export default <C extends React.ComponentType<any>>(
  UnthemedComponent: React.ComponentProps<C> extends { theme?: Theme }
    ? C
    : never,
) => {
  return withTheme((props: { theme?: Theme }) => {
    return props.theme && props.theme.type ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <UnthemedComponent {...props} />
    ) : (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <UnthemedComponent
        {...props}
        theme={getDefaultTheme((props.theme ?? {}) as Base16Theme)}
      />
    );
  });
};

// TODO: memoize it?
