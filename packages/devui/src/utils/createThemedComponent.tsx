import React from 'react';
import getDefaultTheme, { Theme } from '../themes/default';
import { withTheme } from 'styled-components';
import { Base16Theme } from 'base16';

export default <C extends React.ComponentType<any>>(
  UnthemedComponent: React.ComponentProps<C> extends { theme?: Theme }
    ? C
    : never
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
