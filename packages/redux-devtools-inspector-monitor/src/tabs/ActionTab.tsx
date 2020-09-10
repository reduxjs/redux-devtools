import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';

const ActionTab: FunctionComponent<TabComponentProps<
  unknown,
  Action<unknown>
>> = ({
  action,
  styling,
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
      getItemString(styling, type, data, dataTypeKey, isWideLayout)
    }
    invertTheme={invertTheme}
    hideRoot
  />
);

ActionTab.propTypes = {
  action: PropTypes.any.isRequired,
  styling: PropTypes.func.isRequired,
  base16Theme: PropTypes.any.isRequired,
  invertTheme: PropTypes.bool.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  dataTypeKey: PropTypes.string,
  isWideLayout: PropTypes.bool.isRequired,
};

export default ActionTab;
