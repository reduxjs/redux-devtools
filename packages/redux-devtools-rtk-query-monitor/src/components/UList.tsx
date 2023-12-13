import * as React from 'react';

export type UListProps = React.HTMLAttributes<HTMLUListElement>;

export function UList(props: UListProps): JSX.Element {
  return (
    <ul
      {...props}
      css={(theme) => ({
        listStyle: 'none',
        padding: '0 0 0 1em',
        color: theme.ULIST_COLOR,
        '& > li': {
          listStyle: 'none',
        },
        '& > li::before': {
          content: '"\\2022"',
          display: 'inline-block',
          paddingRight: '0.5em',
          color: theme.ULIST_DISC_COLOR,
          fontSize: '0.8em',
        },

        '& strong': {
          color: theme.ULIST_STRONG_COLOR,
        },
      })}
    />
  );
}
