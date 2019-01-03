import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Dialog } from '../src';

describe('Dialog', function () {
  it('renders correctly', () => {
    const wrapper = render(<Dialog />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Dialog
        title="Dialog Title"
        open
        fullWidth
      >
        Hello Dialog!
      </Dialog>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders modal', () => {
    const wrapper = render(<Dialog modal />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should handle dismiss event', () => {
    const onDismiss = jest.fn();
    const wrapper = mount(<Dialog open onDismiss={onDismiss} />);

    wrapper.find('button').first().simulate('click');
    expect(onDismiss).toBeCalled();
  });

  it('should handle submit event', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<Dialog open onSubmit={onSubmit} />);

    wrapper.find('button').last().simulate('click');
    expect(onSubmit).toBeCalled();
  });
});
