import React from 'react';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';

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
