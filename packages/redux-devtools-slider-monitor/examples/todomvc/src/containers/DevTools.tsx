import React from 'react';
import { createDevTools } from '@redux-devtools/core';
import { DockMonitor } from '@redux-devtools/dock-monitor';
import { SliderMonitor } from '@redux-devtools/slider-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultPosition="bottom"
    defaultSize={0.15}
  >
    <SliderMonitor keyboardEnabled />
  </DockMonitor>,
);
