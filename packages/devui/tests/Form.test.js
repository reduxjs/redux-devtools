import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Form } from '../src';
import { schema, uiSchema, formData } from '../src/Form/stories/schema';

describe('Form', function() {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Form formData={formData} schema={schema} uiSchema={uiSchema} />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with primary button', () => {
    const wrapper = shallow(
      <Form
        primaryButton
        submitText="Custom button"
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with no button', () => {
    const wrapper = shallow(
      <Form formData={formData} schema={schema} uiSchema={uiSchema} noSubmit />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should handle the submit event', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(
      <Form
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />
    );

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toBeCalled();
  });
});
