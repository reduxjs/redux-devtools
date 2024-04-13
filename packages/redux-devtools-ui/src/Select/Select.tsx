import React, { PureComponent, Component, ReactElement } from 'react';
import ReactSelect, {
  GroupBase,
  Props as ReactSelectProps,
} from 'react-select';
import createThemedComponent from '../utils/createThemedComponent';
import { Theme } from '../themes/default';

export interface SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<ReactSelectProps<Option, IsMulti, Group>, 'theme'> {
  theme: Theme;
}

/**
 * Wrapper around [React Select](https://github.com/JedWatson/react-select).
 */
export class Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends (PureComponent || Component)<SelectProps<Option, IsMulti, Group>> {
  render() {
    return (
      <ReactSelect
        {...this.props}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,

            primary: this.props.theme.base05,
            primary50: this.props.theme.base03,
            primary25: this.props.theme.base01,

            dangerLight: this.props.theme.base03,
            danger: this.props.theme.base07,

            neutral0: this.props.theme.base00,
            neutral5: this.props.theme.base01,
            neutral10: this.props.theme.base02,
            neutral20: this.props.theme.base03,
            neutral30: this.props.theme.base04,
            neutral40: this.props.theme.base05,
            neutral60: this.props.theme.base06,
            neutral80: this.props.theme.base07,
          },
          spacing: {
            ...theme.spacing,
            baseUnit: 2,
            controlHeight: this.props.theme.inputHeight,
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
}

export interface ExternalSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<ReactSelectProps<Option, IsMulti, Group>, 'theme'> {
  theme?: Theme;
}

type SelectComponent = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ExternalSelectProps<Option, IsMulti, Group>,
) => ReactElement;

export default createThemedComponent(Select) as SelectComponent & {
  theme?: Theme;
};
