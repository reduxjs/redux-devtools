import * as React from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';

export type UListProps = React.HTMLAttributes<HTMLUListElement>;

export function UList(props: UListProps): JSX.Element {
  return (
    <StyleUtilsContext.Consumer>
      {({ styling }) => <ul {...props} {...styling('uList')} />}
    </StyleUtilsContext.Consumer>
  );
}
