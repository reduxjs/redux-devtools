import React, { FunctionComponent } from 'react';
import { StylingFunction } from 'react-base16-styling';
import {
  rightSliderCss,
  rightSliderRotateCss,
  rightSliderRotateShownCss,
  rightSliderShownCss,
} from './utils/createStylingFromTheme';

interface Props {
  styling: StylingFunction;
  shown?: boolean;
  children: React.ReactNode;
  rotate?: boolean;
}

const RightSlider: FunctionComponent<Props> = ({
  styling,
  shown,
  children,
  rotate,
}) => (
  <div
    css={[
      rightSliderCss,
      shown && rightSliderShownCss,
      rotate && rightSliderRotateCss,
      rotate && shown && rightSliderRotateShownCss,
    ]}
  >
    {children}
  </div>
);

export default RightSlider;
