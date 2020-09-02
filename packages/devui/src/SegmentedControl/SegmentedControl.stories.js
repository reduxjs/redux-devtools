import React from 'react';
import styled from 'styled-components';
import SegmentedControl from './';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default {
  title: 'SegmentedControl',
  component: SegmentedControl,
};

const Template = (args) => (
  <Container>
    <SegmentedControl values={['Button1', 'Button2', 'Button3']} {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  selected: 'Button1',
  disabled: false,
};
Default.argTypes = {
  values: { control: { disable: true } },
  onClick: { control: { disable: true } },
  theme: { control: { disable: true } },
};
