import React from 'react';
import styled from 'styled-components';
import { MdPlayArrow } from 'react-icons/md';
import { MdFiberManualRecord } from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import {
  Toolbar,
  Divider,
  Spacer,
  Button,
  Select,
  Slider,
  SegmentedControl,
  Tabs as TabsComponent,
} from '../';
import { options } from '../Select/options';
import { simple10Tabs } from '../Tabs/data';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SliderContainer = styled.div`
  width: 90%;
  height: 80px;
`;

export default {
  title: 'Toolbar',
  component: Toolbar,
};

const Template = ({
  borderPosition,
  title,
  tooltipPosition,
  disabled,
  onClick,
  label,
}) => (
  <Container>
    <Toolbar borderPosition={borderPosition}>
      <Button
        title={title}
        tooltipPosition={tooltipPosition}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Button>
      <Divider />
      <Button
        title={title}
        tooltipPosition={tooltipPosition}
        disabled={disabled}
        onClick={onClick}
      >
        <MdFiberManualRecord />
      </Button>
      <Divider />
      <Spacer />
      <Select options={options} />
    </Toolbar>
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  borderPosition: 'top',
  title: 'Hello Tooltip',
  tooltipPosition: 'top',
  disabled: false,
  label: 'Hello Button',
};
Default.argTypes = {
  borderPosition: {
    control: {
      type: 'select',
      options: ['top', 'bottom'],
    },
  },
  tooltipPosition: {
    control: {
      type: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
      ],
    },
  },
  onClick: {
    action: 'button clicked',
  },
};

const TabsTemplate = ({
  title,
  tooltipPosition,
  disabled,
  buttonOnClick,
  label,
  selected,
  main,
  tabOnClick,
  collapsible,
  position,
}) => (
  <Container>
    <Toolbar>
      <Button
        title={title}
        tooltipPosition={tooltipPosition}
        disabled={disabled}
        onClick={buttonOnClick}
      >
        {label}
      </Button>
      <TabsComponent
        tabs={simple10Tabs}
        selected={selected}
        main={main}
        onClick={tabOnClick}
        collapsible={collapsible}
        position={position}
      />
      <Button
        title={title}
        tooltipPosition={tooltipPosition}
        disabled={disabled}
        onClick={buttonOnClick}
      >
        {label}
      </Button>
    </Toolbar>
  </Container>
);

export const Tabs = TabsTemplate.bind({});
Tabs.args = {
  title: 'Hello Tooltip',
  tooltipPosition: 'top',
  disabled: false,
  label: 'Hello Button',
  selected: '2',
  main: true,
  collapsible: true,
  position: 'center',
};
Tabs.argTypes = {
  tooltipPosition: {
    control: {
      type: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
      ],
    },
  },
  buttonOnClick: {
    action: 'button clicked',
  },
  tabOnClick: {
    action: 'tab selected',
  },
  position: {
    control: {
      type: 'select',
      options: ['left', 'right', 'center'],
    },
  },
};

const WithSliderTemplate = ({
  title,
  tooltipPosition,
  playOnClick,
  value,
  min,
  max,
  label,
  withValue,
  onChange,
  previousStateOnClick,
  nextStateOnClick,
  selected,
  segmentedControlOnClick,
}) => (
  <Container>
    <SliderContainer>
      <Toolbar noBorder fullHeight compact>
        <Button
          title={title}
          tooltipPosition={tooltipPosition}
          onClick={playOnClick}
        >
          <MdPlayArrow />
        </Button>
        <Slider
          value={value}
          min={min}
          max={max}
          label={label}
          withValue={withValue}
          onChange={onChange}
        />
        <Button
          title="Previous state"
          tooltipPosition={tooltipPosition}
          disabled
          onClick={previousStateOnClick}
        >
          <MdKeyboardArrowLeft />
        </Button>
        <Button
          title="Next state"
          tooltipPosition={tooltipPosition}
          onClick={nextStateOnClick}
        >
          <MdKeyboardArrowRight />
        </Button>
        <SegmentedControl
          values={['live', '1x']}
          selected={selected}
          onClick={segmentedControlOnClick}
        />
      </Toolbar>
    </SliderContainer>
  </Container>
);

export const WithSlider = WithSliderTemplate.bind({});
WithSlider.args = {
  title: 'Play',
  tooltipPosition: 'top',
  value: 80,
  min: 0,
  max: 100,
  label: 'Slider label',
  withValue: false,
  selected: 'live',
};
WithSlider.argTypes = {
  tooltipPosition: {
    control: {
      type: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
      ],
    },
  },
  playOnClick: {
    action: 'button clicked',
  },
  onChange: {
    action: 'slider changed',
  },
  previousStateOnClick: {
    action: 'previous state clicked',
  },
  nextStateOnClick: {
    action: 'next state clicked',
  },
  selected: {
    control: {
      type: 'select',
      options: ['live', '1x'],
    },
  },
  segmentedControlOnClick: {
    action: 'button selected',
  },
};
