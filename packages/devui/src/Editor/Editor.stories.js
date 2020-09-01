import React from 'react';
import Editor from './';
import { default as WithTabsComponent } from './WithTabs';

const value = `
var themes = [];

function getThemes() {
  return themes;
}
`;

export default {
  title: 'Editor',
  component: Editor,
};

const Template = (args) => <Editor {...args} />;

export const Default = Template.bind({});
Default.args = {
  value,
  lineNumbers: true,
  lineWrapping: false,
  foldGutter: true,
  readOnly: false,
  autofocus: true,
};

const WithTabsTemplate = (args) => <WithTabsComponent {...args} />;

export const WithTabs = WithTabsTemplate.bind({});
WithTabs.args = {
  lineNumbers: true,
  align: 'left',
};
// storiesOf('Editor', module)
//   .addDecorator(withKnobs)
//   .add(
//     'default',
//     () => (
//       <Editor
//         value={text('value', value)}
//         lineNumbers={boolean('lineNumbers', true)}
//         lineWrapping={boolean('lineWrapping', false)}
//         foldGutter={boolean('foldGutter', true)}
//         readOnly={boolean('readOnly', false)}
//         onChange={action('change')}
//         autofocus
//       />
//     ),
//     { info: 'Based on [CodeMirror](http://codemirror.net/).' }
//   )
//   .add('with tabs', () => (
//     <WithTabs lineNumbers={boolean('lineNumbers', true)} />
//   ));
