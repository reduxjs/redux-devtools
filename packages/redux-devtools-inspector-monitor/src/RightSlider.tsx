import React, { FunctionComponent } from 'react';
import {
  rightSliderCss,
  rightSliderRotateCss,
  rightSliderRotateShownCss,
  rightSliderShownCss,
} from './utils/createStylingFromTheme';

interface Props {
  shown?: boolean;
  children: React.ReactNode;
  rotate?: boolean;
}

const RightSlider: FunctionComponent<Props> = ({ shown, children, rotate }) => (
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
