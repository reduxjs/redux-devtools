import * as React from 'react';
import { createDevTools } from '@redux-devtools/core';
import { RtkQueryMonitor } from '../src';

const MonitorAsAny = RtkQueryMonitor as any;

export const ReduxDevTools = createDevTools(<MonitorAsAny />);
