import React, { FunctionComponent } from 'react';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString.js';
import getJsonTreeTheme from './getJsonTreeTheme.js';
import { TabComponentProps } from '../ActionPreview.js';

const ActionTab: FunctionComponent<
  TabComponentProps<unknown, Action<string>>
> = ({
  action,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
  sortStateTreeAlphabetically,
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
    sortObjectKeys={sortStateTreeAlphabetically}
  />
);

export default ActionTab;
