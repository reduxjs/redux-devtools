import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs';
import Select from '../';
import { options } from './options';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  
  > div {
    width: 90%;
  }
`;

storiesOf('Select', module)
  .addDecorator(withKnobs)
  .addWithInfo(
    'default',
    'Wrapper around [React Select](https://github.com/JedWatson/react-select) with themes and new props like `openOuterUp` and `menuMaxHeight`.',
    () => (
      <Container>
        <Select
          value={text('value', 'one')}
          menuMaxHeight={number('menuMaxHeight', 200)}
          options={options}
          onChange={action('selected')}
          autosize={boolean('autosize', false)}
          clearable={boolean('clearable', false)}
          disabled={boolean('disabled', false)}
          isLoading={boolean('isLoading', false)}
          multi={boolean('multiselect', false)}
          searchable={boolean('searchable', true)}
          openOuterUp={boolean('openOuterUp', false)}
        />
      </Container>
    )
  );
