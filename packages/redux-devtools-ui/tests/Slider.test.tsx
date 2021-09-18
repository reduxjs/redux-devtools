import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Slider } from '../src';

describe('Slider', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <Slider
        onChange={() => {
          // noop
        }}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Slider
        label="Hi"
        min={1}
        max={10}
        value={5}
        disabled
        onChange={() => {
          // noop
        }}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should handle the change event', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Slider value={1} onChange={onChange} />);

    wrapper.find('input').simulate('change');
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith(1);
  });
});
