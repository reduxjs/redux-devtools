import React, { ComponentType } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getDefaultTheme, { Theme } from '../themes/default';
import { withTheme } from 'styled-components';
import { Base16Theme } from 'base16';

export default <C extends React.ComponentType<any>>(
  UnthemedComponent: React.ComponentProps<C> extends { theme?: Theme }
    ? C
    : never
) => {
  const ThemedComponent = React.forwardRef<C, React.ComponentProps<C>>(
    (props, ref) => {
      // eslint-disable-next-line react/prop-types
      if (props.theme && props.theme.type) {
        const ThemedComponent = withTheme(
          UnthemedComponent as ComponentType<{ theme?: Theme }>
        );
        return <ThemedComponent {...props} ref={ref} />;
      }
      const UnthemedComponentAny = UnthemedComponent as any;
      return (
        <UnthemedComponentAny
          {...props}
          ref={ref}
          theme={getDefaultTheme({} as Base16Theme)}
        />
      );
    }
  );

  hoistNonReactStatics(ThemedComponent, UnthemedComponent);

  ThemedComponent.displayName = `ThemedComponent(${
    UnthemedComponent.displayName ?? 'Component'
  })`;

  return ThemedComponent;
};

// TODO: memoize it?
