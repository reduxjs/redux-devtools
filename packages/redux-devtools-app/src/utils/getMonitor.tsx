import React from 'react';
import LogMonitor from '@redux-devtools/log-monitor';
import RtkQueryInspectorMonitorWrapper from '../containers/monitors/RtkQueryMonitorWrapper';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';
import InspectorWrapper from '../containers/monitors/InspectorWrapper';

export const monitors = [
  { value: 'InspectorMonitor', name: 'Inspector' },
  { value: 'LogMonitor', name: 'Log monitor' },
  { value: 'ChartMonitor', name: 'Chart' },
  { value: 'RtkQueryMonitor', name: 'RTK Query' },
];

export default function getMonitor({ monitor }: { monitor: string }) {
  switch (monitor) {
    case 'LogMonitor':
      return (
        <LogMonitor preserveScrollTop={false} hideMainButtons markStateDiff />
      );
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    case 'RtkQueryMonitor':
      return <RtkQueryInspectorMonitorWrapper />;
    default:
      return <InspectorWrapper />;
  }
}
