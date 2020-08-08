import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import MdFiberManualRecord from 'react-icons/lib/md/fiber-manual-record';
import Button from '../';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Container>
      <Button
        title={text('Title', 'Hello Tooltip! \\a And from new line hello!')}
        tooltipPosition={select('tooltipPosition', [
          'top',
          'bottom',
          'left',
          'right',
          'bottom-left',
          'bottom-right',
          'top-left',
          'top-right',
        ])}
        primary={boolean('primary', true)}
        size={select('size', ['big', 'normal', 'small'], 'normal')}
        disabled={boolean('Disabled', false)}
        onClick={action('button clicked')}
      >
        {text('Label', 'Hello Button')}
      </Button>
    </Container>
  ))
  .add('mark', () => (
    <Container>
      <Button
        mark={select(
          'mark',
          [
            'base08',
            'base09',
            'base0A',
            'base0B',
            'base0C',
            'base0D',
            'base0E',
            'base0F',
          ],
          'base08'
        )}
        title={text('Title', 'Hello Tooltip')}
        tooltipPosition={select('tooltipPosition', [
          'top',
          'bottom',
          'left',
          'right',
          'bottom-left',
          'bottom-right',
          'top-left',
          'top-right',
        ])}
        size={select('size', ['big', 'normal', 'small'], 'normal')}
        disabled={boolean('Disabled', false)}
        onClick={action('button clicked')}
      >
        <MdFiberManualRecord />
      </Button>
    </Container>
  ));
