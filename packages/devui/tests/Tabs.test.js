import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Tabs } from '../src';
import { tabs, simple10Tabs } from '../src/Tabs/stories/data';

describe('Tabs', function () {
  it('renders correctly', () => {
    const wrapper = render(<Tabs tabs={tabs} onClick={() => {}} />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Tabs tabs={tabs} onClick={() => {}} selected="Tab2" />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders tabs without inner components', () => {
    const wrapper = render(
      <Tabs tabs={simple10Tabs} onClick={() => {}} selected="5" />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should select tab', () => {
    const onClick = jest.fn();
    const wrapper = mount(<Tabs tabs={tabs} onClick={onClick} />);

    wrapper.find('button').first().simulate('click');
    expect(onClick).toBeCalled();
  });
});
