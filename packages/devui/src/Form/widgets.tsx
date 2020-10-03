import React from 'react';
import { FieldProps, Widget, WidgetProps } from '@rjsf/core';
import Select from '../Select';
import Slider from '../Slider';

/* eslint-disable react/prop-types */
const SelectWidget: Widget = ({ options, ...rest }) => (
  <Select options={options.enumOptions} {...rest} />
);

const RangeWidget: Widget = (({
  schema,
  disabled,
  label, // eslint-disable-line
  options, // eslint-disable-line
  formContext, // eslint-disable-line
  registry, // eslint-disable-line
  ...rest
}: WidgetProps & { registry: FieldProps['registry'] }) =>
  (
    <Slider
      {...rest}
      disabled={disabled}
      min={schema.minimum}
      max={schema.maximum}
      withValue
    />
  ) as unknown) as Widget;

export default { SelectWidget, RangeWidget };
