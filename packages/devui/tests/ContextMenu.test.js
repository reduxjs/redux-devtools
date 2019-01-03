import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { ContextMenu } from '../src';
import { items } from '../src/ContextMenu/stories/data';

describe('ContextMenu', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <ContextMenu
        items={items}
        onClick={() => {}}
        x={100}
        y={100}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
  it('should handle the click event', () => {
    const onClick = jest.fn();
    const wrapper = mount(
    <ContextMenu
      items={items}
      onClick={onClick}
      x={100}
      y={100}
    />);

    wrapper.find('button').first().simulate('click');
    expect(onClick).toBeCalled();
  });
});
