import { section, SectionState } from './section.js';
import { monitor, MonitorState } from './monitor.js';
import { notification, NotificationState } from './notification.js';
import { instances, InstancesState } from './instances.js';
import { reports, ReportsState } from './reports.js';
import { theme, ThemeState } from './theme.js';
import { stateTreeSettings, StateTreeSettings } from './stateTreeSettings.js';

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
