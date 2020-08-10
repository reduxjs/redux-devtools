import React from 'react';
import { connect } from 'react-redux';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import DevtoolsInspector from '../../../src/DevtoolsInspector';
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

export const getDevTools = (location) =>
  createDevTools(
    <DockMonitor
      defaultIsVisible
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
    >
      <DevtoolsInspector
        theme={getOptions(location).theme}
        shouldPersistState
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

const UnconnectedDevTools = ({ location }) => {
  const DevTools = getDevTools(location);
  return <DevTools />;
};

const mapStateToProps = (state) => ({
  location: state.router.location,
});

export const ConnectedDevTools = connect(mapStateToProps)(UnconnectedDevTools);
