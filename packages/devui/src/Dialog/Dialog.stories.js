import React from 'react';
import Dialog from './';
import { schema, uiSchema, formData } from '../Form/stories/schema';

export default {
  title: 'Dialog',
  component: Dialog,
};

const Template = (args) => <Dialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Dialog Title',
  submitText: 'Submit!',
  open: true,
  noHeader: false,
  noFooter: false,
  modal: false,
  fullWidth: false,
  children: 'Hello Dialog!',
};

export const WithForm = Template.bind({});
WithForm.args = {
  open: true,
  noHeader: false,
  noFooter: false,
  fullWidth: false,
  submitText: 'Submit!',
  formData,
  schema,
  uiSchema,
};
// storiesOf('Dialog', module)
//   .addDecorator(withKnobs)
//   .add('default', () => (
//     <Dialog
//       title={text('title', 'Dialog Title')}
//       submitText={text('submitText', 'Submit!')}
//       open={boolean('open', true)}
//       noHeader={boolean('noHeader', false)}
//       noFooter={boolean('noFooter', false)}
//       modal={boolean('modal', false)}
//       fullWidth={boolean('fullWidth', false)}
//       onDismiss={action('dialog dismissed')}
//       onSubmit={action('dialog submitted')}
//     >
//       {text('children', 'Hello Dialog!')}
//     </Dialog>
//   ))
//   .add('with form', () => (
//     <Dialog
//       open={boolean('open', true)}
//       noHeader={boolean('noHeader', false)}
//       noFooter={boolean('noFooter', false)}
//       fullWidth={boolean('fullWidth', false)}
//       submitText={text('submitText', 'Submit!')}
//       formData={object('formData', formData)}
//       schema={object('schema', schema)}
//       uiSchema={object('uiSchema', uiSchema)}
//       onChange={action('form changed')}
//       onSubmit={action('form submitted')}
//       onDismiss={action('dialog dismissed')}
//     />
//   ));
