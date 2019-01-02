import { configure, setAddon, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import infoAddon from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withTheme } from './themeAddon/theme';
import '../src/presets.js';

setAddon(infoAddon);
setOptions({
  name: 'DevUI',
  url: 'https://github.com/zalmoxisus/devui',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true
});

addDecorator(withTheme);
addDecorator(withKnobs);

const req = require.context('../src/', true, /stories\/index\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
