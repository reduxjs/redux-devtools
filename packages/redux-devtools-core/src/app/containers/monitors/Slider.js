import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import SliderMonitor from 'redux-slider-monitor';

const SliderWrapper = styled.div`
  border-color: ${props => props.theme.base02};
  border-style: solid;
  border-width: 1px 0;
`;

class Slider extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.theme.scheme !== this.props.theme.scheme
    );
  }
  render() {
    return (
      <SliderWrapper>
        <SliderMonitor
          {...this.props.liftedState}
          dispatch={this.props.dispatch}
          theme={this.props.theme}
          hideResetButton
        />
      </SliderWrapper>
    );
  }
}

Slider.propTypes = {
  liftedState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(Slider);
