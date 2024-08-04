import { css, ThemedStyledProps } from 'styled-components';
import { Theme } from '../../themes/default';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default ({ theme }: ThemedStyledProps<{}, Theme>) => css`
  padding: 10px;
  line-height: 1.846;
  font-size: 14px;
  color: ${theme.base06};

  fieldset {
    padding: 0;
    margin: 0;
    border: 0;
    min-width: 0;
  }

  legend {
    display: block;
    width: 100%;
    padding: 0;
    font-size: 20px;
    color: ${theme.base04};
    border: 0;
  }

  label {
    display: inline-block;
    max-width: 100%;
    font-weight: bold;
  }

  .form-control {
    display: block;
    box-sizing: border-box;
    font-size: 12px;
    width: 100%;
    color: ${theme.base05};
    background-color: transparent;
    background-image: none;
    line-height: ${theme.inputInternalHeight}px;
    padding: 0 ${theme.inputPadding}px;
    border-style: solid;
    border-width: ${theme.inputBorderWidth}px;
    border-color: ${theme.inputBorderColor};
    border-radius: ${theme.inputBorderRadius}px;
  }

  .form-control:focus,
  input.form-control:focus {
    outline: 0;
    ${theme.inputFocusedStyle}
  }

  .form-control[disabled],
  .form-control[readonly],
  fieldset[disabled] .form-control {
    background-color: transparent;
    opacity: 1;
  }

  .form-control[disabled],
  fieldset[disabled] .form-control {
    cursor: not-allowed;
  }

  textarea.form-control {
    height: auto;
  }

  .form-group {
    margin-bottom: 5px;
  }

  .radio,
  .checkbox {
    position: relative;
    display: block;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .radio label,
  .checkbox label {
    min-height: 23px;
    padding-left: 20px;
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
  }

  .radio input[type='radio'],
  .radio-inline input[type='radio'],
  .checkbox input[type='checkbox'],
  .checkbox-inline input[type='checkbox'] {
    position: absolute;
    margin-left: -20px;
    margin-top: 4px \\9;
  }

  .radio + .radio,
  .checkbox + .checkbox {
    margin-top: -5px;
  }

  .radio-inline,
  .checkbox-inline {
    position: relative;
    display: inline-block;
    padding-left: 25px;
    margin-bottom: 0;
    vertical-align: middle;
    font-weight: normal;
    cursor: pointer;
  }

  .radio-inline + .radio-inline,
  .checkbox-inline + .checkbox-inline {
    margin-top: 0;
    margin-left: 10px;
  }

  .radio label,
  .radio-inline label,
  .checkbox label,
  .checkbox-inline label {
    padding-left: 25px;
  }

  .radio input[type='radio'],
  .radio-inline input[type='radio'],
  .checkbox input[type='radio'],
  .checkbox-inline input[type='radio'],
  .radio input[type='checkbox'],
  .radio-inline input[type='checkbox'],
  .checkbox input[type='checkbox'],
  .checkbox-inline input[type='checkbox'] {
    margin-left: -25px;
  }

  input[type='radio'],
  .radio input[type='radio'],
  .radio-inline input[type='radio'] {
    position: relative;
    margin-top: 6px;
    margin-right: 4px;
    vertical-align: top;
    border: none;
    background-color: transparent;
    appearance: none;
    cursor: pointer;
  }

  input[type='radio']:focus,
  .radio input[type='radio']:focus,
  .radio-inline input[type='radio']:focus {
    outline: none;
  }

  input[type='radio']:before,
  .radio input[type='radio']:before,
  .radio-inline input[type='radio']:before,
  input[type='radio']:after,
  .radio input[type='radio']:after,
  .radio-inline input[type='radio']:after {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    transition: 240ms;
    box-sizing: border-box;
  }

  input[type='radio']:before,
  .radio input[type='radio']:before,
  .radio-inline input[type='radio']:before {
    position: absolute;
    left: 0;
    top: -3px;
    background-color: ${theme.base0D};
    transform: scale(0);
  }

  input[type='radio']:after,
  .radio input[type='radio']:after,
  .radio-inline input[type='radio']:after {
    position: relative;
    top: -3px;
    border: 2px solid ${theme.base03};
  }

  input[type='radio']:checked:before,
  .radio input[type='radio']:checked:before,
  .radio-inline input[type='radio']:checked:before {
    transform: scale(0.5);
  }

  input[type='radio']:disabled:checked:before,
  .radio input[type='radio']:disabled:checked:before,
  .radio-inline input[type='radio']:disabled:checked:before {
    background-color: ${theme.base03};
  }

  input[type='radio']:checked:after,
  .radio input[type='radio']:checked:after,
  .radio-inline input[type='radio']:checked:after {
    border-color: ${theme.base0D};
  }

  input[type='radio']:disabled:after,
  .radio input[type='radio']:disabled:after,
  .radio-inline input[type='radio']:disabled:after,
  input[type='radio']:disabled:checked:after,
  .radio input[type='radio']:disabled:checked:after,
  .radio-inline input[type='radio']:disabled:checked:after {
    border-color: ${theme.base03};
  }

  input[type='checkbox'],
  .checkbox input[type='checkbox'],
  .checkbox-inline input[type='checkbox'] {
    position: relative;
    border: none;
    margin-bottom: -4px;
    appearance: none;
    cursor: pointer;
  }

  input[type='checkbox']:focus,
  .checkbox input[type='checkbox']:focus,
  .checkbox-inline input[type='checkbox']:focus {
    outline: none;
  }

  input[type='checkbox']:focus:after,
  .checkbox input[type='checkbox']:focus:after,
  .checkbox-inline input[type='checkbox']:focus:after {
    border-color: ${theme.base0D};
  }

  input[type='checkbox']:after,
  .checkbox input[type='checkbox']:after,
  .checkbox-inline input[type='checkbox']:after {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    margin-top: -2px;
    margin-right: 5px;
    border: 2px solid ${theme.base03};
    border-radius: 4px;
    transition: 240ms;
    box-sizing: border-box;
  }

  input[type='checkbox']:checked:before,
  .checkbox input[type='checkbox']:checked:before,
  .checkbox-inline input[type='checkbox']:checked:before {
    content: '';
    position: absolute;
    top: 0;
    left: 6px;
    display: table;
    width: 6px;
    height: 12px;
    border: 2px solid #fff;
    border-top-width: 0;
    border-left-width: 0;
    transform: rotate(45deg);
    box-sizing: border-box;
  }

  input[type='checkbox']:checked:after,
  .checkbox input[type='checkbox']:checked:after,
  .checkbox-inline input[type='checkbox']:checked:after {
    background-color: ${theme.base0D};
    border-color: ${theme.base0D};
  }

  input[type='checkbox']:disabled:after,
  .checkbox input[type='checkbox']:disabled:after,
  .checkbox-inline input[type='checkbox']:disabled:after {
    border-color: ${theme.base03};
  }

  input[type='checkbox']:disabled:checked:after,
  .checkbox input[type='checkbox']:disabled:checked:after,
  .checkbox-inline input[type='checkbox']:disabled:checked:after {
    background-color: ${theme.base03};
    border-color: transparent;
  }

  input[type='radio'][disabled],
  input[type='checkbox'][disabled],
  input[type='radio'].disabled,
  input[type='checkbox'].disabled,
  fieldset[disabled] input[type='radio'],
  fieldset[disabled] input[type='checkbox'] {
    cursor: not-allowed;
  }

  .radio-inline.disabled,
  .checkbox-inline.disabled,
  fieldset[disabled] .radio-inline,
  fieldset[disabled] .checkbox-inline {
    cursor: not-allowed;
  }

  .radio.disabled label,
  .checkbox.disabled label,
  fieldset[disabled] .radio label,
  fieldset[disabled] .checkbox label {
    cursor: not-allowed;
  }

  .has-error .help-block,
  .has-error .control-label,
  .has-error .radio,
  .has-error .checkbox,
  .has-error .radio-inline,
  .has-error .checkbox-inline,
  .has-error.radio label,
  .has-error.checkbox label,
  .has-error.radio-inline label,
  .has-error.checkbox-inline label {
    color: ${theme.base08};
  }

  .panel {
    border: none;
    border-radius: 2px;
    box-shadow: 0 1px 4px ${theme.base03};
    margin-bottom: 23px;
  }

  .panel-heading {
    padding: 5px 15px;
  }

  .panel-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 15px;
  }

  .panel-danger {
    box-shadow: 0 1px 4px ${theme.base08};
  }

  .panel-danger > .panel-heading {
    color: ${theme.base00};
    background-color: ${theme.base08};
  }

  .text-danger {
    color: ${theme.base08};
  }

  .list-group {
    padding: 0;
    margin: 0;
  }

  .list-group-item {
    position: relative;
    display: block;
    padding: 10px 15px;
  }
`;
