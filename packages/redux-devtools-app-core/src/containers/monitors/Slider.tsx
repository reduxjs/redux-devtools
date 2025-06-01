import React, { Component } from 'react';
import styled from '@emotion/styled';
import { withTheme } from '@emotion/react';
import { SliderMonitor } from '@redux-devtools/slider-monitor';
import { LiftedAction } from '@redux-devtools/core';
import { Action } from 'redux';
import { Base16Theme, ThemeFromProvider } from '@redux-devtools/ui';
import { State } from '../../reducers/instances';

const SliderWrapper = styled.div`
  border-color: ${(props: { theme?: Base16Theme }) => props.theme!.base02};
  border-style: solid;
  border-width: 1px 0;
`;

interface Props {
  liftedState: State;
  dispatch: (action: LiftedAction<unknown, Action<string>, unknown>) => void;
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
      <SliderWrapper className="slider">
        <SliderMonitor
          {...this.props.liftedState}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dispatch={this.props.dispatch}
          theme={this.props.theme}
          hideResetButton
        />
      </SliderWrapper>
    );
  }
}

export default withTheme(Slider);
