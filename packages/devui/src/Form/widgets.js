import React from 'react';
import Select from '../Select';
import Slider from '../Slider';

/* eslint-disable react/prop-types */
const SelectWidget = ({ options, multi, ...rest }) => (
  <Select options={options.enumOptions} multiple={multi} {...rest} />
);

const RangeWidget = ({
  schema, readonly, autofocus,
  label, // eslint-disable-line
  options, // eslint-disable-line
  formContext, // eslint-disable-line
  registry, // eslint-disable-line
  ...rest
}) => (
  <Slider
    {...rest}
    autoFocus={autofocus}
    readOnly={readonly}
    min={schema.minimum}
    max={schema.maximum}
    step={schema.multipleOf}
    withValue
  />
);

export default { SelectWidget, RangeWidget };
