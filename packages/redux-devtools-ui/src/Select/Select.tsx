import React from 'react';
import ReactSelect, {
  GroupBase,
  Props as ReactSelectProps,
} from 'react-select';
import { useTheme } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<ReactSelectProps<Option, IsMulti, Group>, 'theme'> {}

/**
 * Wrapper around [React Select](https://github.com/JedWatson/react-select).
 */
export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: SelectProps<Option, IsMulti, Group>) {
  const uiTheme = useTheme();

  return (
    <ReactSelect
      {...props}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,

          primary: uiTheme.base05,
          primary50: uiTheme.base03,
          primary25: uiTheme.base01,

          dangerLight: uiTheme.base03,
          danger: uiTheme.base07,

          neutral0: uiTheme.base00,
          neutral5: uiTheme.base01,
          neutral10: uiTheme.base02,
          neutral20: uiTheme.base03,
          neutral30: uiTheme.base04,
          neutral40: uiTheme.base05,
          neutral60: uiTheme.base06,
          neutral80: uiTheme.base07,
        },
        spacing: {
          ...theme.spacing,
          baseUnit: 2,
          controlHeight: uiTheme.inputHeight,
        },
      })}
      styles={{
        container: (base) => ({
          ...base,
          flexGrow: 1,
        }),
        control: (base, props) => ({
          ...base,
          backgroundColor: props.isFocused
            ? props.theme.colors.neutral10
            : props.theme.colors.neutral5,
          borderColor: props.theme.colors.neutral10,

          '&:hover': {
            backgroundColor: props.theme.colors.neutral10,
            borderColor: props.theme.colors.neutral10,
          },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 10,
        }),
      }}
    />
  );
}

export default Select;
