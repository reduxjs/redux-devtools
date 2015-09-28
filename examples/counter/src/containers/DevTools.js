import { createDevTools } from 'redux-devtools';
import createLogMonitor from 'redux-devtools-log-monitor';
import createDockMonitor from '../dock/DockMonitor';

export default createDevTools(
  createDockMonitor(
    createLogMonitor()
  )
);
