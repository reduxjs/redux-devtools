import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import Editor from '../';
import WithTabs from './WithTabs';

const value = `
var themes = [];

function getThemes() {
  return themes;
}
`;

storiesOf('Editor', module)
  .addDecorator(withKnobs)
  .add(
    'default',
    () => (
      <Editor
        value={text('value', value)}
        lineNumbers={boolean('lineNumbers', true)}
        lineWrapping={boolean('lineWrapping', false)}
        foldGutter={boolean('foldGutter', true)}
        readOnly={boolean('readOnly', false)}
        onChange={action('change')}
        autofocus
      />
    ),
    { info: 'Based on [CodeMirror](http://codemirror.net/).' }
  )
  .add(
    'with tabs',
    () => (
      <WithTabs
        lineNumbers={boolean('lineNumbers', true)}
      />
    )
  );
