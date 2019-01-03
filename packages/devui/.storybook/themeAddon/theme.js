import React from 'react';
import addons from '@storybook/addons';
import styled from 'styled-components';
import { EVENT_ID_DATA, DEFAULT_THEME_STATE } from './constant';
import { Container } from '../../src';

const ContainerStyled = styled(Container)`
  > div {
    height: 100%;
    width: 100%;

    > div {
      height: 100%;
      width: 100%;
      overflow-y: auto;
    }
  }
`;

const channel = addons.getChannel();

class Theme extends React.Component {
  state = DEFAULT_THEME_STATE;

  componentDidMount() {
    channel.on(EVENT_ID_DATA, this.onChannel);
  }

  componentWillUnmount() {
    channel.removeListener(EVENT_ID_DATA, this.onChannel);
  }

  onChannel = state => {
    this.setState(state);
  };

  render() {
    return <ContainerStyled themeData={this.state}>{this.props.children}</ContainerStyled>;
  }
}

export const withTheme = story => <Theme>{story()}</Theme>;
