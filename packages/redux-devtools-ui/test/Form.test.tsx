import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '../src';
import { schema, uiSchema, formData } from '../src/Form/schema';

describe('Form', function () {
  let random: () => number;

  beforeAll(() => {
    random = Math.random;
    Math.random = jest.fn(() => 0.25546350798039463);
  });

  afterAll(() => {
    Math.random = random;
    console.log(Math.random());
  });

  it('renders correctly', () => {
    const { container } = render(
      <Form formData={formData} schema={schema} uiSchema={uiSchema} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with primary button', () => {
    const { container } = render(
      <Form
        primaryButton
        submitText="Custom button"
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with no button', () => {
    const { container } = render(
      <Form formData={formData} schema={schema} uiSchema={uiSchema} noSubmit />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle the submit event', async () => {
    const onSubmit = jest.fn();
    render(
      <Form
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
