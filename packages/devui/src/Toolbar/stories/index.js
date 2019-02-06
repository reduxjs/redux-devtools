import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import {
  withKnobs,
  text,
  number,
  boolean,
  select
} from '@storybook/addon-knobs';
import PlayIcon from 'react-icons/lib/md/play-arrow';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import LeftIcon from 'react-icons/lib/md/keyboard-arrow-left';
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right';
import {
  Toolbar,
  Divider,
  Spacer,
  Button,
  Select,
  Slider,
  SegmentedControl,
  Tabs
} from '../../';
import { options } from '../../Select/stories/options';
import { simple10Tabs } from '../../Tabs/stories/data';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const SliderContainer = styled.div`
  width: 90%;
  height: 80px;
`;

storiesOf('Toolbar', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Container>
      <Toolbar borderPosition={select('borderPosition', ['top', 'bottom'])}>
        <Button
          title={text('Title', 'Hello Tooltip')}
          tooltipPosition={select('tooltipPosition', [
            'top',
            'bottom',
            'left',
            'right',
            'bottom-left',
            'bottom-right',
            'top-left',
            'top-right'
          ])}
          disabled={boolean('Disabled', false)}
          onClick={action('button clicked')}
        >
          {text('Label', 'Hello Button')}
        </Button>
        <Divider />
        <Button
          title={text('Title', 'Hello Tooltip')}
          tooltipPosition={select('tooltipPosition', [
            'top',
            'bottom',
            'left',
            'right',
            'bottom-left',
            'bottom-right',
            'top-left',
            'top-right'
          ])}
          disabled={boolean('Disabled', false)}
          onClick={action('button clicked')}
        >
          <RecordIcon />
        </Button>
        <Divider />
        <Spacer />
        <Select options={options} />
      </Toolbar>
    </Container>
  ))
  .add('tabs', () => (
    <Container>
      <Toolbar>
        <Button
          title={text('Title', 'Hello Tooltip')}
          tooltipPosition={select('tooltipPosition', [
            'top',
            'bottom',
            'left',
            'right',
            'bottom-left',
            'bottom-right',
            'top-left',
            'top-right'
          ])}
          disabled={boolean('Disabled', false)}
          onClick={action('button clicked')}
        >
          {text('Label', 'Hello Button')}
        </Button>
        <Tabs
          tabs={simple10Tabs}
          selected={text('selected', '2')}
          main={boolean('main', true)}
          onClick={action('tab selected')}
          collapsible={boolean('collapsible', true)}
          position={select('position', ['left', 'right', 'center'], 'center')}
        />
        <Button
          title={text('Title', 'Hello Tooltip')}
          tooltipPosition={select('tooltipPosition', [
            'top',
            'bottom',
            'left',
            'right',
            'bottom-left',
            'bottom-right',
            'top-left',
            'top-right'
          ])}
          disabled={boolean('Disabled', false)}
          onClick={action('button clicked')}
        >
          {text('Label', 'Hello Button')}
        </Button>
      </Toolbar>
    </Container>
  ))
  .add('with slider', () => (
    <Container>
      <SliderContainer>
        <Toolbar noBorder fullHeight compact>
          <Button
            title={text('play title', 'Play')}
            tooltipPosition={select('tooltipPosition', [
              'top',
              'bottom',
              'left',
              'right',
              'bottom-left',
              'bottom-right',
              'top-left',
              'top-right'
            ])}
            onClick={action('button clicked')}
          >
            <PlayIcon />
          </Button>
          <Slider
            value={number('value', 80)}
            min={number('min', 0)}
            max={number('max', 100)}
            label={text('label', 'Slider label')}
            withValue={boolean('withValue', false)}
            onChange={action('slider changed')}
          />
          <Button
            title="Previous state"
            tooltipPosition={select('tooltipPosition', [
              'top',
              'bottom',
              'left',
              'right',
              'bottom-left',
              'bottom-right',
              'top-left',
              'top-right'
            ])}
            disabled
            onClick={action('previous state clicked')}
          >
            <LeftIcon />
          </Button>
          <Button
            title="Next state"
            tooltipPosition={select('tooltipPosition', [
              'top',
              'bottom',
              'left',
              'right',
              'bottom-left',
              'bottom-right',
              'top-left',
              'top-right'
            ])}
            onClick={action('next state clicked')}
          >
            <RightIcon />
          </Button>
          <SegmentedControl
            values={['live', '1x']}
            selected={select('selected', ['live', '1x'], 'live')}
            onClick={action('button selected')}
          />
        </Toolbar>
      </SliderContainer>
    </Container>
  ));
