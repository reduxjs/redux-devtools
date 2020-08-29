import React from 'react';
import JSONDiff from './JSONDiff';

const DiffTab = ({
  delta,
  styling,
  base16Theme,
  invertTheme,
  labelRenderer,
  isWideLayout,
}) => (
  <JSONDiff
    {...{
      delta,
      styling,
      base16Theme,
      invertTheme,
      labelRenderer,
      isWideLayout,
    }}
  />
);

export default DiffTab;
