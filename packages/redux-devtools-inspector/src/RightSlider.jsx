import React from 'react';
import { PropTypes } from 'prop-types';

const RightSlider = ({ styling, shown, children, rotate }) => (
  <div
    {...styling([
      'rightSlider',
      shown && 'rightSliderShown',
      rotate && 'rightSliderRotate',
      rotate && shown && 'rightSliderRotateShown',
    ])}
  >
    {children}
  </div>
);

RightSlider.propTypes = {
  shown: PropTypes.bool,
};

export default RightSlider;
