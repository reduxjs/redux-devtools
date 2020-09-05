import React from 'react';
import styled from 'styled-components';
import { Story } from '@storybook/react';
import Slider from './';
import { SliderProps } from './Slider';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default {
  title: 'Slider',
  component: Slider,
};

const Template: Story<SliderProps> = (args) => (
  <Container>
    <Slider {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  value: 0,
  min: 0,
  max: 100,
  label: 'Slider label',
  sublabel: '(sublabel}',
  withValue: false,
  disabled: false,
};
Default.argTypes = {
  onChange: { control: { disable: true } },
  theme: { control: { disable: true } },
};
