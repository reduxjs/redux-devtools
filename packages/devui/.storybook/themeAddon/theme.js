import React from 'react';
import addons from '@storybook/addons';
import { EVENT_ID_DATA, DEFAULT_THEME_STATE } from './constant';
import { Container } from '../../src';

const channel = addons.getChannel();

class Theme extends React.Component {
  state = DEFAULT_THEME_STATE;

  componentDidMount() {
    channel.on(EVENT_ID_DATA, this.onChannel);
  }

  componentWillUnmount() {
    channel.removeListener(EVENT_ID_DATA, this.onChannel);
  }

  onChannel = (state) => {
    this.setState(state);
  };

  render() {
    return <Container themeData={this.state}>{this.props.children}</Container>;
  }
}

export const withTheme = (story) => <Theme>{story()}</Theme>;
