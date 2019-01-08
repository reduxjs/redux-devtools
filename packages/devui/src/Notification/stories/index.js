import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import Notification from '../';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

storiesOf('Notification', module)
  .addDecorator(withKnobs)
  .add(
    'default',
    () => (
      <Container>
        <Notification
          type={
            select('type', ['info', 'success', 'warning', 'error'], 'warning')
          }
          onClose={action('notification closed')}
        >
          {text('Message', 'Hello Notification')}
        </Notification>
      </Container>
    )
  );
