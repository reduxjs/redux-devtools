import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Notification } from '../src';

describe('Notification', function () {
  it('renders correctly', () => {
    const wrapper = render(<Notification>Message</Notification>);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Notification type="error" onClose={() => {}}>
        Message
      </Notification>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should handle the click event', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Notification onClose={onClose}>Message</Notification>
    );

    wrapper.find('button').simulate('click');
    expect(onClose).toBeCalled();
  });
});
