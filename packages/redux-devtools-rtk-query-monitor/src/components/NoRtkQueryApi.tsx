import React from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';

export function NoRtkQueryApi(): JSX.Element {
  return (
    <StyleUtilsContext.Consumer>
      {({ styling }) => (
        <div {...styling('noApiFound')}>
          No rtk-query api found.
          <br />
          Make sure to follow{' '}
          <a
            href="https://redux-toolkit.js.org/rtk-query/overview#basic-usage"
            target="_blank"
            rel="noreferrer noopener"
          >
            the instructions
          </a>
          .
        </div>
      )}
    </StyleUtilsContext.Consumer>
  );
}
