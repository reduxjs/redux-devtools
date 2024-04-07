import React from 'react';
import { withTheme } from 'styled-components';
import type { Base16Theme } from 'react-base16-styling';
import getDefaultTheme, { Theme } from '../themes/default';

export default <C extends React.ComponentType<any>>(
  UnthemedComponent: React.ComponentProps<C> extends { theme?: Theme }
    ? C
    : never,
) => {
  return withTheme((props) => {
    return props.theme && props.theme.type ? (
      <UnthemedComponent {...props} />
    ) : (
      <UnthemedComponent
        {...props}
        theme={getDefaultTheme((props.theme ?? {}) as Base16Theme)}
      />
    );
  });
};

// TODO: memoize it?
