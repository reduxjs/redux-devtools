import * as React from 'react';
import { createDevTools } from '@redux-devtools/core';
import DockMonitor from '@redux-devtools/dock-monitor';
import RtkQueryMonitor from '../../../../src';

const largeScreenQuery = window.matchMedia('(min-width: 1024px)');

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
    fluid
    defaultSize={largeScreenQuery.matches ? 0.44 : 0.55}
  >
    <RtkQueryMonitor />
  </DockMonitor>
);
