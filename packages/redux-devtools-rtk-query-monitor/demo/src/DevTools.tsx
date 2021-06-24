import * as React from 'react';
import { createDevTools } from '@redux-devtools/core';
import DockMonitor from '@redux-devtools/dock-monitor';
import RtkQueryMonitor from './build';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
  >
    <RtkQueryMonitor />
  </DockMonitor>
);
