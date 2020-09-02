import React from 'react';
import styled from 'styled-components';
import Slider from './';

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

const Template = (args) => (
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

// storiesOf('Slider', module)
//   .addDecorator(withKnobs)
//   .add('default', () => (
//     <Container>
//       <Slider
//         value={number('value', 0)}
//         min={number('min', 0)}
//         max={number('max', 100)}
//         label={text('label', 'Slider label')}
//         sublabel={text('sublabel', '(sublabel)')}
//         withValue={boolean('withValue', false)}
//         disabled={boolean('disabled', false)}
//         onChange={action('slider changed')}
//       />
//     </Container>
//   ));
