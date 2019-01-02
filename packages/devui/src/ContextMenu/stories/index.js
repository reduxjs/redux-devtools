import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { withKnobs, number } from '@storybook/addon-knobs';
import ContextMenu from '../';
import { items } from './data';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

storiesOf('ContextMenu', module)
  .addDecorator(withKnobs)
  .addWithInfo(
    'default',
    '',
    () => (
      <Container>
        <ContextMenu
          visible
          onClick={action('menu item clicked')}
          x={number('x', 100)}
          y={number('y', 100)}
          items={items}
        />
      </Container>
    )
  );
