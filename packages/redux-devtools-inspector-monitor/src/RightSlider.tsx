import React, { FunctionComponent } from 'react';

interface Props {
  shown?: boolean;
  children: React.ReactNode;
  rotate?: boolean;
}

const RightSlider: FunctionComponent<Props> = ({ shown, children, rotate }) => (
  <div
    css={[
      {
        WebkitFontSmoothing: 'subpixel-antialiased', // http://stackoverflow.com/a/21136111/4218591
        position: 'absolute',
        right: 0,
        transform: 'translateX(150%)',
        transition: 'transform 0.2s ease-in-out',
      },
      shown && {
        position: 'static',
        transform: 'translateX(0)',
      },
      rotate && {
        transform: 'rotateX(90deg)',
        transition: 'transform 0.2s ease-in-out 0.08s',
      },
      rotate &&
        shown && {
          transform: 'rotateX(0)',
          transition: 'transform 0.2s ease-in-out 0.18s',
        },
    ]}
  >
    {children}
  </div>
);

export default RightSlider;
