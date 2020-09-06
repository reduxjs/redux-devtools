import React from 'react';
import styled from 'styled-components';
import { MdFiberManualRecord } from 'react-icons/md';
import { Story } from '@storybook/react';
import Button from './';
import { ButtonProps } from './Button';

export default {
  title: 'Button',
  component: Button,
};

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Template: Story<ButtonProps> = (args) => (
  <Container>
    <Button {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Hello Tooltip! \\a And from new line hello!',
  tooltipPosition: 'top',
  primary: true,
  size: 'normal',
  disabled: false,
  children: 'Hello Button',
};
Default.argTypes = {
  onClick: { control: { disable: true } },
  type: { control: { disable: true } },
  mark: { control: { disable: true } },
  theme: { control: { disable: true } },
};

export const Mark = Template.bind({});
Mark.args = {
  mark: 'base08',
  title: 'Hello Tooltip',
  tooltipPosition: 'top',
  size: 'normal',
  disabled: false,
  children: <MdFiberManualRecord />,
};
Mark.argTypes = {
  children: { control: { disable: true } },
  onClick: { control: { disable: true } },
  type: { control: { disable: true } },
  primary: { control: { disable: true } },
  theme: { control: { disable: true } },
};
