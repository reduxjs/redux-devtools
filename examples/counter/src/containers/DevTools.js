import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from '../dock/DockMonitor';

export default createDevTools(
  <DockMonitor defaultPosition='bottom'>
    <LogMonitor theme='ocean' />
  </DockMonitor>
);
