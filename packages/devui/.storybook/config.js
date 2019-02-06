import { configure, setAddon, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withTheme } from './themeAddon/theme';
import '../src/presets.js';

addDecorator(
  withOptions({
    name: 'DevUI',
    url: 'https://github.com/reduxjs/redux-devtools/tree/master/packages/devui',
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: true
  })
);

addDecorator(withTheme);
addDecorator(withKnobs);
addDecorator(withInfo);

const req = require.context('../src/', true, /stories\/index\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
