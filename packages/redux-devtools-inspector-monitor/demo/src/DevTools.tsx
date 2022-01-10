import React from 'react';
import { connect } from 'react-redux';
import { createDevTools } from '@redux-devtools/core';
import { DockMonitor } from '@redux-devtools/dock-monitor';
import { Location } from 'history';
import {
  InspectorMonitor,
  base16Themes,
} from '@redux-devtools/inspector-monitor';
import getOptions from './getOptions';
import { DemoAppState } from './reducers';

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
        theme={getOptions(location).theme as keyof typeof base16Themes}
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
    </DockMonitor>
  );

const UnconnectedDevTools = ({ location }: { location: Location }) => {
  const DevTools = getDevTools(location);
  return <DevTools />;
};

const mapStateToProps = (state: DemoAppState) => ({
  location: state.router.location,
});

export const ConnectedDevTools = connect(mapStateToProps)(UnconnectedDevTools);
