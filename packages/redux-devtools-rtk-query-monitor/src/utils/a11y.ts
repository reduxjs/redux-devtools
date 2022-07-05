import { QueryPreviewTabs } from '../types';

export function renderTabPanelId(value: QueryPreviewTabs): string {
  return `rtk-query-monitor-tab-panel-${value}`;
}

export function renderTabPanelButtonId(value: QueryPreviewTabs): string {
  return renderTabPanelId(value) + '-button';
}
