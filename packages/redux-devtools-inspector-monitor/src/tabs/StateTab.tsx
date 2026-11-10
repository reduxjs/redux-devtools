import React from 'react';
import { JSONTree } from 'react-json-tree';
import type { Action } from 'redux';
import getItemString from './getItemString.js';
import getJsonTreeTheme from './getJsonTreeTheme.js';
import type { TabComponentProps } from '../ActionPreview.js';

const StateTab: React.FunctionComponent<
  TabComponentProps<any, Action<string>>
> = ({
  nextState,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
  sortStateTreeAlphabetically,
  disableStateTreeCollection,
}) => (
  <JSONTree
    labelRenderer={labelRenderer}
    theme={getJsonTreeTheme(base16Theme)}
    data={nextState}
    getItemString={(type, data) =>
      getItemString(type, data, dataTypeKey, isWideLayout)
    }
    invertTheme={invertTheme}
    hideRoot
    sortObjectKeys={sortStateTreeAlphabetically}
    {...(disableStateTreeCollection ? { collectionLimit: 0 } : {})}
  />
);

export default StateTab;
