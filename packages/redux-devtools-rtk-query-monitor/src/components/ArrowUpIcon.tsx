import React, { HTMLAttributes } from 'react';

export type ArrowUpIconProps = Omit<
  HTMLAttributes<SVGElement>,
  'xmlns' | 'children' | 'viewBox'
>;

/* eslint-disable max-len */
/**
 * @see https://icons.getbootstrap.com/icons/arrow-up/
 */
export function ArrowUpIcon(props: ArrowUpIconProps): JSX.Element {
  return (
    <svg
      fill="currentColor"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
      />
    </svg>
  );
}
/* eslint-enable max-len */
