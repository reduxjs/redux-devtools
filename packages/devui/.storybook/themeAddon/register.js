import React from 'react';
import addons from '@storybook/addons';
import Panel from './Panel';
import { ADDON_ID, PANEL_ID } from './constant';

addons.register(ADDON_ID, api => {
  const channel = addons.getChannel();
  addons.addPanel(PANEL_ID, {
    title: 'Theme',
    render: () => <Panel channel={channel} api={api} />
  });
});
