import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import {
  InspectorMonitor,
  base16Themes,
  Tab,
} from '@redux-devtools/inspector-monitor';
import { DockMonitor } from '@redux-devtools/dock-monitor';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import getOptions from './getOptions';
import { TestTab } from '@redux-devtools/inspector-monitor-test-tab';
import { Action } from 'redux';

export const getDevTools = (location: { search: string }) =>
  createDevTools(
    <DockMonitor
      defaultIsVisible
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
    >
      <InspectorMonitor
        theme={getOptions(location).theme as keyof typeof base16Themes}
        invertTheme={!getOptions(location).dark}
        supportImmutable={getOptions(location).supportImmutable}
        tabs={(defaultTabs) =>
          [
            {
              name: 'Test',
              component: TestTab,
            },
            ...defaultTabs,
          ] as Tab<unknown, Action<unknown>>[]
        }
      />
    </DockMonitor>
  );

const UnconnectedDevTools = ({ location }: RouteComponentProps) => {
  const DevTools = getDevTools(location);
  return <DevTools />;
};

export const ConnectedDevTools = withRouter(UnconnectedDevTools);
