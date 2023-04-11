import React from 'react';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';

const StateTab: React.FunctionComponent<
  TabComponentProps<any, Action<unknown>>
> = ({
  nextState,
  styling,
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
      getItemString(styling, type, data, dataTypeKey, isWideLayout)
    }
    invertTheme={invertTheme}
    hideRoot
    sortObjectKeys={sortStateTreeAlphabetically}
    {...(disableStateTreeCollection ? { collectionLimit: 0 } : {})}
  />
);

StateTab.propTypes = {
  nextState: PropTypes.any.isRequired,
  styling: PropTypes.func.isRequired,
  base16Theme: PropTypes.any.isRequired,
  invertTheme: PropTypes.bool.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  dataTypeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  isWideLayout: PropTypes.bool.isRequired,
};

export default StateTab;
