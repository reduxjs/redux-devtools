import React from 'react';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';
import { VanillaJSONEditor } from './VanillaJSONEditor';

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
}) => {
  return (
      <VanillaJSONEditor
        content={{
          json: nextState
        }}
        readOnly={true}
      />
  );
}

export default StateTab;
