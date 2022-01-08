import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import JSONDiff from './JSONDiff';
import { TabComponentProps } from '../ActionPreview';
import { Action } from 'redux';

const DiffTab: FunctionComponent<
  TabComponentProps<unknown, Action<unknown>>
> = ({
  delta,
  styling,
  base16Theme,
  invertTheme,
  labelRenderer,
  isWideLayout,
  dataTypeKey,
}) => (
  <JSONDiff
    {...{
      delta,
      styling,
      base16Theme,
      invertTheme,
      labelRenderer,
      isWideLayout,
      dataTypeKey,
    }}
  />
);

DiffTab.propTypes = {
  delta: PropTypes.any,
  styling: PropTypes.func.isRequired,
  base16Theme: PropTypes.any.isRequired,
  invertTheme: PropTypes.bool.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  isWideLayout: PropTypes.bool.isRequired,
  dataTypeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
};

export default DiffTab;
