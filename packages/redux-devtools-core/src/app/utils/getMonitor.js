import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LogMonitor from 'redux-devtools-log-monitor';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';
import InspectorWrapper from '../containers/monitors/InspectorWrapper';

export const monitors = [
  { value: 'InspectorMonitor', name: 'Inspector' },
  { value: 'LogMonitor', name: 'Log monitor' },
  { value: 'ChartMonitor', name: 'Chart' }
];

export default function getMonitor({ monitor }) { // eslint-disable-line react/prop-types
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} hideMainButtons markStateDiff />;
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    default:
      return <InspectorWrapper />;
  }
}
