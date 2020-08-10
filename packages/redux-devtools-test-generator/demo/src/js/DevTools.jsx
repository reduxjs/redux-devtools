import React from 'react';
import { connect } from 'react-redux';
import { createDevTools } from 'redux-devtools';
import DevtoolsInspector from 'redux-devtools-inspector';
import DockMonitor from 'redux-devtools-dock-monitor';
import getOptions from './getOptions';
import TestGenerator from '../../../src';

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
            name: 'Test',
            component: TestGenerator,
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
