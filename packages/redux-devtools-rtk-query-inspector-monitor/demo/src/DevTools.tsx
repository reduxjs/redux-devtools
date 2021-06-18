import * as React from 'react';
import { createDevTools } from '@redux-devtools/core';
import DockMonitor from '@redux-devtools/dock-monitor';
import RtkQueryInspectorMonitor from './build/RtkQueryInspectorMonitor.js';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
  >
    <RtkQueryInspectorMonitor />
  </DockMonitor>
);
