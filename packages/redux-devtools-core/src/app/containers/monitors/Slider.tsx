import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import SliderMonitor from 'redux-devtools-slider-monitor';
import { LiftedAction, LiftedState } from 'redux-devtools-instrument';
import { Action, Dispatch } from 'redux';
import { ThemeFromProvider } from 'devui';

const SliderWrapper = styled.div`
  border-color: ${(props) => props.theme.base02};
  border-style: solid;
  border-width: 1px 0;
`;

interface Props {
  liftedState: LiftedState<unknown, Action<unknown>, unknown>;
  dispatch: Dispatch<LiftedAction<unknown, Action<unknown>, unknown>>;
  theme: ThemeFromProvider;
}

class Slider extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
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

export default withTheme(Slider);
