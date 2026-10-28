import React, { FunctionComponent } from 'react';
import JSONDiff from './JSONDiff.js';
import { TabComponentProps } from '../ActionPreview.js';
import { Action } from 'redux';

const DiffTab: FunctionComponent<
  TabComponentProps<unknown, Action<string>>
> = ({
  delta,
  base16Theme,
  invertTheme,
  labelRenderer,
  isWideLayout,
  dataTypeKey,
  sortStateTreeAlphabetically,
}) => (
  <JSONDiff
    {...{
      delta,
      base16Theme,
      invertTheme,
      labelRenderer,
      isWideLayout,
      dataTypeKey,
      sortObjectKeys: sortStateTreeAlphabetically,
    }}
  />
);

export default DiffTab;
