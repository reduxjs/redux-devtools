import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from '../dock/DockMonitor';

export default createDevTools(
  <DockMonitor>
    <LogMonitor theme='ocean' />
  </DockMonitor>
);
