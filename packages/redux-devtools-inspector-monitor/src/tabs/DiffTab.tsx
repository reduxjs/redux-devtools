import React, { FunctionComponent } from 'react';
import JSONDiff from './JSONDiff';
import { TabComponentProps } from '../ActionPreview';
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
}) => (
  <JSONDiff
    {...{
      delta,
      base16Theme,
      invertTheme,
      labelRenderer,
      isWideLayout,
      dataTypeKey,
    }}
  />
);

export default DiffTab;
