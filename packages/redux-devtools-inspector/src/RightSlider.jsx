import React, { PropTypes } from 'react';

const RightSlider = ({ styling, shown, children, rotate }) =>
  <div {...styling([
    'rightSlider',
    shown && 'rightSliderShown',
    rotate && 'rightSliderRotate',
    rotate && shown && 'rightSliderRotateShown'
  ])}>
    {children}
  </div>;

RightSlider.propTypes = {
  shown: PropTypes.bool
};

export default RightSlider;
