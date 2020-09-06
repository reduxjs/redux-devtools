import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { SegmentedControl } from '../src';

describe('SegmentedControl', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <SegmentedControl
        values={['Button1', 'Button2', 'Button3']}
        selected="Button1"
        disabled={false}
        onClick={() => {}}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
  it('should handle the click event', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <SegmentedControl
        values={['Button1', 'Button2', 'Button3']}
        selected="Button1"
        disabled={false}
        onClick={onClick}
      />
    );

    wrapper.find('button').first().simulate('click');
    expect(onClick).toBeCalled();
  });
});
