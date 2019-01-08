import React from 'react';
import Form from '@storybook/addon-knobs/dist/components/PropForm';
import styled from 'styled-components';
import { EVENT_ID_DATA, DEFAULT_THEME_STATE } from './constant';
import { listSchemes, listThemes } from '../../src/utils/theme';

const FormWrapper = styled.div`
  width: 100%;
  padding: 5px;

  label {
    white-space: nowrap;
  }
`;

const schemes = listSchemes();
const themes = listThemes();

export default class Panel extends React.Component {
  state = DEFAULT_THEME_STATE;

  onChange = o => {
    const state = { [o.name.split(' ').slice(-1)[0]]: o.value };
    this.props.channel.emit(EVENT_ID_DATA, state);
    this.setState(state);
  };

  onClick = () => {};

  render() {
    const { theme, scheme, light } = this.state;
    return (
      <FormWrapper>
        <Form
          knobs={[
            {
              type: 'select',
              name: 'theme',
              value: theme,
              options: themes
            },
            {
              type: 'select',
              name: 'color scheme',
              value: scheme,
              options: schemes
            },
            {
              type: 'boolean',
              name: 'light',
              value: light
            }
          ]}
          onFieldChange={this.onChange}
          onFieldClick={this.onClick}
        />
      </FormWrapper>
    );
  }
}
