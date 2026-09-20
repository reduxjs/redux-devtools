import React from 'react';
import { FieldProps, Widget, WidgetProps } from '@rjsf/utils';
import Select from '../Select/index.js';
import Slider from '../Slider/index.js';

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
    options={options.enumOptions}
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
  label,
  options,
  formContext,
  registry,
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
