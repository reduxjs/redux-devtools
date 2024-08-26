import React from 'react';
import { FieldProps, Widget, WidgetProps } from '@rjsf/utils';
import Select from '../Select';
import Slider from '../Slider';

/* eslint-disable react/prop-types */
const SelectWidget: Widget = ({
  options,
  onChange,
  value,
  onBlur,
  defaultValue,
  tabIndex,
  onFocus,
  'aria-invalid': ariaInvalid,
  ...rest
}) => (
  <Select<{ label: string; value: string }>
    options={options.enumOptions as { label: string; value: string }[]}
    onChange={(option) => {
      onChange(option?.value);
    }}
    value={(options.enumOptions as { label: string; value: string }[]).find(
      (option) => option.value === value,
    )}
    {...rest}
  />
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
