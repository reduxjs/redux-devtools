import React, { PureComponent, Component } from 'react';
import JSONSchemaForm, { FormProps } from '@rjsf/core';
import type { Base16Theme } from 'react-base16-styling';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';
import Button from '../Button';
import customWidgets from './widgets';

const FormContainer = createStyledComponent(styles, JSONSchemaForm);

export interface Props<T> extends FormProps<T> {
  children?: React.ReactNode;
  submitText?: string;
  primaryButton?: boolean;
  noSubmit?: boolean;
  theme?: Base16Theme;
}

/**
 * Wrapper around [`react-jsonschema-form`](https://github.com/rjsf-team/react-jsonschema-form) with custom widgets.
 */
export default class Form<T> extends (PureComponent || Component)<Props<T>> {
  render() {
    const { widgets, children, submitText, primaryButton, noSubmit, ...rest } =
      this.props;
    return (
      <FormContainer
        {...(rest as Props<unknown>)}
        widgets={{ ...customWidgets, ...widgets }}
      >
        {noSubmit ? (
          <noscript />
        ) : (
          children || (
            <Button
              size="big"
              primary={primaryButton}
              theme={rest.theme}
              type="submit"
            >
              {submitText || 'Submit'}
            </Button>
          )
        )}
      </FormContainer>
    );
  }
}
