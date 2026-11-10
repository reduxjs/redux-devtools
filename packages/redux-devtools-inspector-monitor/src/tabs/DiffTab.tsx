import type { FunctionComponent } from 'react';
import React from 'react';
import JSONDiff from './JSONDiff.js';
import type { TabComponentProps } from '../ActionPreview.js';
import type { Action } from 'redux';

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
