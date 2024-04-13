import React from 'react';

export function NoRtkQueryApi(): JSX.Element {
  return (
    <div
      css={(theme) => ({
        width: '100%',
        textAlign: 'center',
        color: theme.TEXT_COLOR,
        padding: '1.4em',
        '& a': {
          fontSize: 'inherit',
          color: theme.TEXT_COLOR,
          textDecoration: 'underline',
        },
      })}
    >
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
  );
}
