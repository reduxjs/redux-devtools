import React from 'react';
import styled from 'styled-components';
import Notification from './';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default {
  title: 'Notification',
  component: Notification,
};

const Template = (args) => (
  <Container>
    <Notification {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  type: 'warning',
  children: 'Hello Notification',
};
Default.argTypes = {
  onClose: { control: { disable: true } },
  theme: { control: { disable: true } },
};
