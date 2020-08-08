import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Button } from '../src';

describe('Button', function () {
  it('renders correctly', () => {
    const wrapper = render(<Button>Text</Button>);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should handle the click event', () => {
    const onClick = jest.fn();
    const wrapper = mount(<Button onClick={onClick}>ClickMe</Button>);

    wrapper.find('button').simulate('click');
    expect(onClick).toBeCalled();
  });
});
