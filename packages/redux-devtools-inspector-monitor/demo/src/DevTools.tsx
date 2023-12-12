import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import { DockMonitor } from '@redux-devtools/dock-monitor';
import { InspectorMonitor } from '@redux-devtools/inspector-monitor';
import type { Base16ThemeName } from '@redux-devtools/inspector-monitor';
import { useLocation } from 'react-router-dom';
import getOptions from './getOptions';

const CustomComponent = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      minHeight: '20rem',
    }}
  >
    <div>Custom Tab Content</div>
  </div>
);

export const getDevTools = (location: { search: string }) =>
  createDevTools(
    <DockMonitor
      defaultIsVisible
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
    >
      <InspectorMonitor
        theme={getOptions(location).theme as Base16ThemeName}
        invertTheme={!getOptions(location).dark}
        supportImmutable={getOptions(location).supportImmutable}
        tabs={(defaultTabs) => [
          {
            name: 'Custom Tab',
            component: CustomComponent,
          },
          ...defaultTabs,
        ]}
      />
    </DockMonitor>,
  );

export function ConnectedDevTools() {
  const location = useLocation();
  const DevTools = getDevTools(location);
  return <DevTools />;
}
