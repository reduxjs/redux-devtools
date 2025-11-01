import React, { HTMLAttributes } from 'react';

export type CopyIconProps = Omit<
  HTMLAttributes<SVGElement>,
  'xmlns' | 'children' | 'viewBox'
>;

/* eslint-disable max-len */
/**
 * @see import { IoCopySharp } from "react-icons/io5";
 */
export function CopyIcon(props: CopyIconProps): React.JSX.Element {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M456 480H136a24 24 0 0 1-24-24V128a16 16 0 0 1 16-16h328a24 24 0 0 1 24 24v320a24 24 0 0 1-24 24z"></path>
      <path d="M112 80h288V56a24 24 0 0 0-24-24H60a28 28 0 0 0-28 28v316a24 24 0 0 0 24 24h24V112a32 32 0 0 1 32-32z"></path>
    </svg>
  );
}
/* eslint-enable max-len */
