import type { SectionState } from './section.js';
import { section } from './section.js';
import type { MonitorState } from './monitor.js';
import { monitor } from './monitor.js';
import type { NotificationState } from './notification.js';
import { notification } from './notification.js';
import type { InstancesState } from './instances.js';
import { instances } from './instances.js';
import type { ReportsState } from './reports.js';
import { reports } from './reports.js';
import type { ThemeState } from './theme.js';
import { theme } from './theme.js';
import type { StateTreeSettings } from './stateTreeSettings.js';
import { stateTreeSettings } from './stateTreeSettings.js';

export interface CoreStoreState {
  readonly section: SectionState;
  readonly theme: ThemeState;
  readonly stateTreeSettings: StateTreeSettings;
  readonly monitor: MonitorState;
  readonly instances: InstancesState;
  readonly reports: ReportsState;
  readonly notification: NotificationState;
}

export const coreReducers = {
  section,
  theme,
  stateTreeSettings,
  monitor,
  instances,
  reports,
  notification,
};
