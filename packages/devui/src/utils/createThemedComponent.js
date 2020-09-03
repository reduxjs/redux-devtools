import React from 'react';
import getDefaultTheme from '../themes/default';
import { withTheme } from 'styled-components';

export default (UnthemedComponent) => (props) =>
  props.theme.type ? (
    withTheme(<UnthemedComponent {...props} />)
  ) : (
    // used outside of container (theme provider)
    <UnthemedComponent {...props} theme={getDefaultTheme(props.theme)} />
  );

// TODO: memoize it?
