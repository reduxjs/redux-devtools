import * as React from 'react';
import { createDevTools } from '@redux-devtools/core';
import DockMonitor from '@redux-devtools/dock-monitor';
import RtkQueryMonitor from './build';

const largeScreenQuery = window.matchMedia('(min-width: 1024px)');

export default createDevTools(
  <DockMonitor
    fluid
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
    defaultSize={largeScreenQuery.matches ? 0.34 : 0.55}
  >
    <RtkQueryMonitor />
  </DockMonitor>
);
