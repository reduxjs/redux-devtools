import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
// import createStyledComponent from '../utils/createStyledComponent';
// import styles from './styles';
//
// const SelectContainer = createStyledComponent(styles, ReactSelect);

/**
 * Wrapper around [React Select](https://github.com/JedWatson/react-select) with themes and new props like `openOuterUp` and `menuMaxHeight`.
 */
export default class Select extends (PureComponent || Component) {
  render() {
    return <ReactSelect {...this.props} />;
  }
}

Select.propTypes = {
  isClearable: PropTypes.bool, // should it be possible to reset value
  isDisabled: PropTypes.bool, // whether the Select is disabled or not
  isLoading: PropTypes.bool, // whether the Select is loading externally or not
  // menuMaxHeight: PropTypes.number, // maximum css height for the opened menu of options
  isMulti: PropTypes.bool, // multi-value input
  isSearchable: PropTypes.bool, // whether to enable searching feature or not
  value: PropTypes.any, // initial field value
  menuPlacement: PropTypes.oneOf(['auto', 'bottom', 'top']), // value to control the opening direction
};
