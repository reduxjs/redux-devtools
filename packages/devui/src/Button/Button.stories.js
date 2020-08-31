import React from 'react';
import styled from 'styled-components';
import { MdFiberManualRecord } from 'react-icons/md';
import Button from './';

export default {
  title: 'Components/Button',
  component: Button,
};

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Template = (args) => (
  <Container>
    <Button {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Hello Tooltip! \\a And from new line hello!',
  primary: true,
  size: 'normal',
  disabled: false,
  children: 'Hello Button',
};
Default.argTypes = {
  onClick: { table: { disable: true } },
  type: { table: { disable: true } },
  mark: { table: { disable: true } },
  theme: { table: { disable: true } },
};

export const Mark = Template.bind({});
Mark.args = {
  mark: 'base08',
  title: 'Hello Tooltip',
  size: 'normal',
  disabled: false,
  children: <MdFiberManualRecord />,
};
Mark.argTypes = {
  children: { table: { disable: true } },
  onClick: { table: { disable: true } },
  type: { table: { disable: true } },
  primary: { table: { disable: true } },
  theme: { table: { disable: true } },
};
