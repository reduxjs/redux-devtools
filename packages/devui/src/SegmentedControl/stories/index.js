import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import SegmentedControl from '../';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

storiesOf('SegmentedControl', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Container>
      <SegmentedControl
        values={['Button1', 'Button2', 'Button3']}
        selected={text('selected', 'Button1')}
        onClick={action('button selected')}
        disabled={boolean('Disabled', false)}
      />
    </Container>
  ));
