import React from 'react';
import { ReactNode } from 'react';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';

export function NoRtkQueryApi(): ReactNode {
  return (
    <StyleUtilsContext.Consumer>
      {({ styling }) => (
        <div {...styling('noApiFound')}>
          No rtk-query api found.<br/>Make sure to follow{' '}
          <a
            href="https://redux-toolkit.js.org/rtk-query/overview#basic-usage"
            target="_blank"
            rel="noreferrer"
          >
            the instructions
          </a>
          .
        </div>
      )}
    </StyleUtilsContext.Consumer>
  );
}
