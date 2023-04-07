import React from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import SegmentedControl from './';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const meta: Meta = {
  title: 'SegmentedControl',
  component: SegmentedControl,
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: ({ values, ...args }) => (
    <Container>
      <SegmentedControl values={['Button1', 'Button2', 'Button3']} {...args} />
    </Container>
  ),
  args: {
    selected: 'Button1',
    disabled: false,
  },
  argTypes: {
    values: { control: { disable: true } },
    onClick: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};
