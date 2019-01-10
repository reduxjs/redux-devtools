import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';

const SelectContainer = createStyledComponent(styles, ReactSelect);

export default class Select extends (PureComponent || Component) {
  render() {
    return <SelectContainer {...this.props} />;
  }
}

Select.propTypes = {
  autosize: PropTypes.bool, // whether to enable autosizing or not
  clearable: PropTypes.bool, // should it be possible to reset value
  disabled: PropTypes.bool, // whether the Select is disabled or not
  isLoading: PropTypes.bool, // whether the Select is loading externally or not
  menuMaxHeight: PropTypes.number, // maximum css height for the opened menu of options
  multi: PropTypes.bool, // multi-value input
  searchable: PropTypes.bool, // whether to enable searching feature or not
  simpleValue: PropTypes.bool, // pass the value with label to onChange
  value: PropTypes.any, // initial field value
  valueKey: PropTypes.string, // path of the label value in option objects
  openOuterUp: PropTypes.bool // value to control the opening direction
};

Select.defaultProps = {
  autosize: true,
  clearable: false,
  simpleValue: true,
  menuMaxHeight: 200
};
