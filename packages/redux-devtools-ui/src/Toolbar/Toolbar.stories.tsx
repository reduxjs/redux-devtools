import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
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
import { BorderPosition } from './styles/Toolbar';
import { TooltipPosition } from '../Button/Button';
import { Position } from '../Tabs/Tabs';

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

const meta: Meta = {
  title: 'Toolbar',
  component: Toolbar,
};

export default meta;

interface TemplateArgs {
  borderPosition: BorderPosition;
  title?: string;
  tooltipPosition: TooltipPosition;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: ReactNode;
}

export const Default: StoryObj<TemplateArgs> = {
  render: ({
    // eslint-disable-next-line react/prop-types
    borderPosition,
    // eslint-disable-next-line react/prop-types
    title,
    // eslint-disable-next-line react/prop-types
    tooltipPosition,
    // eslint-disable-next-line react/prop-types
    disabled,
    // eslint-disable-next-line react/prop-types
    onClick,
    // eslint-disable-next-line react/prop-types
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
  ),
  args: {
    borderPosition: 'top',
    title: 'Hello Tooltip',
    tooltipPosition: 'top',
    disabled: false,
    label: 'Hello Button',
  },
  argTypes: {
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
  },
};

interface TabsTemplateArgs {
  title?: string;
  tooltipPosition: TooltipPosition;
  disabled?: boolean;
  buttonOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: ReactNode;
  selected?: string;
  main?: boolean;
  tabsOnClick: (value: string) => void;
  collapsible?: boolean;
  position: Position;
}

export const Tabs: StoryObj<TabsTemplateArgs> = {
  render: ({
    // eslint-disable-next-line react/prop-types
    title,
    // eslint-disable-next-line react/prop-types
    tooltipPosition,
    // eslint-disable-next-line react/prop-types
    disabled,
    // eslint-disable-next-line react/prop-types
    buttonOnClick,
    // eslint-disable-next-line react/prop-types
    label,
    // eslint-disable-next-line react/prop-types
    selected,
    // eslint-disable-next-line react/prop-types
    main,
    // eslint-disable-next-line react/prop-types
    tabsOnClick,
    // eslint-disable-next-line react/prop-types
    collapsible,
    // eslint-disable-next-line react/prop-types
    position,
    // eslint-disable-next-line react/prop-types
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
          onClick={tabsOnClick}
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
  ),
  args: {
    title: 'Hello Tooltip',
    tooltipPosition: 'top',
    disabled: false,
    label: 'Hello Button',
    selected: '2',
    main: true,
    collapsible: true,
    position: 'center',
  },
  argTypes: {
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
    tabsOnClick: {
      action: 'tab selected',
    },
    position: {
      control: {
        type: 'select',
        options: ['left', 'right', 'center'],
      },
    },
  },
};

interface WithSliderTemplateArgs {
  title?: string;
  tooltipPosition: TooltipPosition;
  playOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  value: number;
  min: number;
  max: number;
  label?: string;
  withValue?: boolean;
  onChange: (value: number) => void;
  previousStateOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  nextStateOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: string;
  segmentedControlOnClick: (value: string) => void;
}

export const WithSlider: StoryObj<WithSliderTemplateArgs> = {
  render: ({
    // eslint-disable-next-line react/prop-types
    title,
    // eslint-disable-next-line react/prop-types
    tooltipPosition,
    // eslint-disable-next-line react/prop-types
    playOnClick,
    // eslint-disable-next-line react/prop-types
    value,
    // eslint-disable-next-line react/prop-types
    min,
    // eslint-disable-next-line react/prop-types
    max,
    // eslint-disable-next-line react/prop-types
    label,
    // eslint-disable-next-line react/prop-types
    withValue,
    // eslint-disable-next-line react/prop-types
    onChange,
    // eslint-disable-next-line react/prop-types
    previousStateOnClick,
    // eslint-disable-next-line react/prop-types
    nextStateOnClick,
    // eslint-disable-next-line react/prop-types
    selected,
    // eslint-disable-next-line react/prop-types
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
  ),
  args: {
    title: 'Play',
    tooltipPosition: 'top',
    value: 80,
    min: 0,
    max: 100,
    label: 'Slider label',
    withValue: false,
    selected: 'live',
  },
  argTypes: {
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
  },
};
