import * as React from 'react';

export type RegexIconProps = Omit<
  React.HTMLAttributes<SVGElement>,
  'viewBox' | 'children'
>;

// `OOjs_UI_icon_regular-expression.svg` (MIT License)
// from https://commons.wikimedia.org/wiki/File:OOjs_UI_icon_regular-expression.svg
export function RegexIcon(
  props: React.HTMLAttributes<SVGElement>
): JSX.Element {
  return (
    <svg fill="currentColor" {...props} viewBox="0 0 24 24">
      <g>
        <path d="M3 12.045c0-.99.15-1.915.45-2.777A6.886 6.886 0 0 1 4.764 7H6.23a7.923 7.923 0 0 0-1.25 2.374 8.563 8.563 0 0 0 .007 5.314c.29.85.7 1.622 1.23 2.312h-1.45a6.53 6.53 0 0 1-1.314-2.223 8.126 8.126 0 0 1-.45-2.732" />
        <path id="dot" d="M10 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        <path d="M14.25 7.013l-.24 2.156 2.187-.61.193 1.47-1.992.14 1.307 1.74-1.33.71-.914-1.833-.8 1.822-1.38-.698 1.296-1.74-1.98-.152.23-1.464 2.14.61-.24-2.158h1.534" />
        <path d="M21 12.045c0 .982-.152 1.896-.457 2.744A6.51 6.51 0 0 1 19.236 17h-1.453a8.017 8.017 0 0 0 1.225-2.31c.29-.855.434-1.74.434-2.66 0-.91-.14-1.797-.422-2.66a7.913 7.913 0 0 0-1.248-2.374h1.465a6.764 6.764 0 0 1 1.313 2.28c.3.86.45 1.782.45 2.764" />
      </g>
    </svg>
  );
}
