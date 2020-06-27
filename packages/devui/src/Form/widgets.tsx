import React from 'react';
import Select from '../Select';
import Slider from '../Slider';
import { FieldProps, Widget, WidgetProps } from 'react-jsonschema-form';
import { Options } from 'react-select';

/* eslint-disable react/prop-types */
const SelectWidget: Widget = ({
  options,
  onFocus,
  onBlur,
  ...rest
}: WidgetProps) => (
  <Select options={options.enumOptions as Options} {...rest} />
);

const RangeWidget: Widget = (({
  schema,
  readonly,
  autofocus,
  label, // eslint-disable-line
  options, // eslint-disable-line
  formContext, // eslint-disable-line
  registry, // eslint-disable-line
  ...rest
}: WidgetProps & { registry: FieldProps['registry'] }) =>
  (
    <Slider {...rest} min={schema.minimum} max={schema.maximum} withValue />
  ) as unknown) as Widget;

export default { SelectWidget, RangeWidget };
