import React from 'react';
import styled from 'styled-components';
import { MdFiberManualRecord } from 'react-icons/md';
import { Meta, StoryObj } from '@storybook/react';
import Button from './';

const meta: Meta = {
  title: 'Button',
  component: Button,
};

export default meta;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
  args: {
    title: 'Hello Tooltip! \\a And from new line hello!',
    tooltipPosition: 'top',
    primary: true,
    size: 'normal',
    disabled: false,
    children: 'Hello Button',
  },
  argTypes: {
    onClick: { control: { disable: true } },
    type: { control: { disable: true } },
    mark: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};

export const Mark: Story = {
  render: Default.render,
  args: {
    mark: 'base08',
    title: 'Hello Tooltip',
    tooltipPosition: 'top',
    size: 'normal',
    disabled: false,
    children: <MdFiberManualRecord />,
  },
  argTypes: {
    children: { control: { disable: true } },
    onClick: { control: { disable: true } },
    type: { control: { disable: true } },
    primary: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};
