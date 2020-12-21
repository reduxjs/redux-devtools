import React from 'react';
import { connect } from 'react-redux';
import { createDevTools } from '@redux-devtools/core';
import InspectorMonitor, {
  base16Themes,
  Tab,
} from '@redux-devtools/inspector-monitor';
import DockMonitor from '@redux-devtools/dock-monitor';
import { Location } from 'history';
import getOptions from './getOptions';
import TestGenerator from '../../../src';
import { DemoAppState } from './reducers';
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
              component: TestGenerator,
            },
            ...defaultTabs,
          ] as Tab<unknown, Action<unknown>>[]
        }
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
