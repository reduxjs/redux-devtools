import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import styled from 'styled-components';
import Tabs from '../';
import { tabs, simple10Tabs } from './data';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

storiesOf('Tabs', module)
  .addDecorator(withKnobs)
  .addWithInfo(
    'default',
    '',
    () => (
      <Container><Tabs
        tabs={simple10Tabs}
        selected={text('selected', '2')}
        main={boolean('main', true)}
        onClick={action('tab selected')}
        collapsible={boolean('collapsible', true)}
        position={select('position', ['left', 'right', 'center'], 'left')}
      /></Container>
    )
  )
  .addWithInfo(
    'with content',
    '',
    () => (
      <Tabs
        tabs={tabs}
        selected={text('selected', 'Tab2')}
        main={boolean('main', false)}
        onClick={action('tab selected')}
        collapsible={boolean('collapsible', false)}
        position={select('position', ['left', 'right', 'center'], 'left')}
      />
    )
  );
