import React from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import Notification from './';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const meta: Meta = {
  title: 'Notification',
  component: Notification,
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  render: (args) => (
    <Container>
      <Notification {...args} />
    </Container>
  ),
  args: {
    type: 'warning',
    children: 'Hello Notification',
  },
  argTypes: {
    onClose: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};
