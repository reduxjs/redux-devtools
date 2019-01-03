import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import Form from '../';
import { schema, uiSchema, formData } from './schema';

storiesOf('Form', module)
  .addDecorator(withKnobs)
  .addWithInfo(
    'default',
    'Wrapper around [`react-jsonschema-form`](https://github.com/mozilla-services/react-jsonschema-form) with custom widgets.',
    () => (
      <Form
        formData={object('formData', formData)}
        schema={object('schema', schema)}
        uiSchema={object('uiSchema', uiSchema)}
        submitText={text('submitText', 'Submit')}
        onChange={action('form changed')}
        onSubmit={action('form submitted')}
      />
    )
  );
