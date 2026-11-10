import type { FunctionComponent } from 'react';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import type { Action } from 'redux';
import getItemString from './getItemString.js';
import getJsonTreeTheme from './getJsonTreeTheme.js';
import type { TabComponentProps } from '../ActionPreview.js';

const ActionTab: FunctionComponent<
  TabComponentProps<unknown, Action<string>>
> = ({
  action,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
}) => (
  <JSONTree
    labelRenderer={labelRenderer}
    theme={getJsonTreeTheme(base16Theme)}
    data={action}
    getItemString={(type, data) =>
      getItemString(type, data, dataTypeKey, isWideLayout)
    }
    invertTheme={invertTheme}
    hideRoot
  />
);

export default ActionTab;
