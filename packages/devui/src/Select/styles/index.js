import { css } from 'styled-components';
import { fadeIn, spinner } from '../../utils/animations';

export default ({ theme, openOuterUp, menuMaxHeight }) => css`
  &.Select {
    position: relative;

    &,
    & div,
    & input,
    & span {
      box-sizing: border-box;
    }

    &.is-disabled > .Select-control {
      background-color: ${theme.base02};

      &:hover {
        box-shadow: none;
      }
    }

    &.is-disabled .Select-arrow-zone {
      cursor: default;
      pointer-events: none;
    }
  }

  .Select-control {
    background-color: ${theme.base00};
    border-color: ${theme.inputBorderColor};
    border-radius: ${theme.inputBorderRadius}px;
    border-style: solid;
    border-width: ${theme.inputBorderWidth}px;
    color: ${theme.base07};
    cursor: default;
    display: table;
    border-spacing: 0;
    border-collapse: separate;
    height: ${theme.inputHeight}px;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;

    &:hover {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    }

    .Select-input:focus {
      outline: none;
    }
  }

  &.is-searchable {
    &.is-open > .Select-control {
      cursor: text;
    }
  }

  &.is-open > .Select-control {
    border-radius: ${openOuterUp
      ? `0 0 ${theme.inputBorderRadius}px ${theme.inputBorderRadius}px`
      : `${theme.inputBorderRadius}px ${theme.inputBorderRadius}px 0 0`};
  }

  &.is-searchable {
    &.is-focused:not(.is-open) > .Select-control {
      cursor: text;
    }
  }

  &.is-focused > .Select-control {
    ${theme.inputFocusedStyle}
  }

  .Select-placeholder,
  &.Select--single > .Select-control .Select-value {
    bottom: 0;
    color: ${theme.base03};
    left: 0;
    line-height: ${theme.inputInternalHeight}px;
    padding: 0 ${theme.inputPadding}px;
    position: absolute;
    right: 0;
    top: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.has-value.Select--single > .Select-control .Select-value,
  &.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value {
    .Select-value-label {
      color: ${theme.base07};
    }

    a.Select-value-label {
      cursor: pointer;
      text-decoration: none;

      &:hover,
      &:focus {
        color: ${theme.base0D};
        outline: none;
        text-decoration: underline;
      }
    }
  }

  .Select-input {
    height: ${theme.inputInternalHeight}px;
    padding-left: ${theme.inputPadding}px;
    padding-right: ${theme.inputPadding}px;
    vertical-align: middle;

    > input {
      color: ${theme.base07};
      background: none transparent;
      border: 0 none;
      box-shadow: none;
      width: 100%;
      cursor: default;
      display: inline-block;
      font-family: inherit;
      font-size: inherit;
      margin: 0;
      outline: none;
      line-height: 14px;
      padding: ${(theme.inputInternalHeight - 14) / 2 - 2}px 0;
      -webkit-appearance: none;

      .is-focused & {
        cursor: text;
      }
    }
  }

  &.has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }

  .Select-control:not(.is-searchable) > .Select-input {
    outline: none;
  }

  .Select-loading-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: ${theme.spinnerSize}px;
  }

  .Select-loading {
    ${spinner(theme)}
    vertical-align: middle;
  }

  .Select-clear-zone {
    animation: ${fadeIn} 200ms;
    color: ${theme.base03};
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;

    &:hover {
      color: #d0021b;
    }
  }

  .Select-clear {
    display: inline-block;
    font-size: ${Math.floor(theme.inputHeight / 2)}px;
    line-height: 1px;
  }

  .Select-clear-zone,
  .Select--multi .Select-clear-zone {
    width: ${theme.inputInternalHeight / 2}px;
  }

  .Select--multi .Select-multi-value-wrapper {
    display: inline-block;
  }

  &.Select .Select-aria-only {
    display: inline-block;
    position: absolute;
    height: 1px;
    width: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
  }

  .Select-arrow-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: ${theme.selectArrowWidth * 5}px;
    padding-right: ${theme.selectArrowWidth}px;
  }

  .Select-arrow {
    border-color: ${theme.base03} transparent transparent;
    border-style: solid;
    border-width: ${theme.selectArrowWidth}px ${theme.selectArrowWidth}px
      ${theme.selectArrowWidth / 2}px;
    display: inline-block;
    height: 0;
    width: 0;
  }

  .is-open .Select-arrow,
  .Select-arrow-zone:hover > .Select-arrow {
    border-top-color: ${theme.base04};
  }

  .Select-menu-outer {
    border: 1px solid ${theme.base02};
    box-shadow: 0 ${openOuterUp ? '-1px' : '1px'} 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    /* stylelint-disable declaration-empty-line-before */
    ${openOuterUp ? 'margin-bottom' : 'margin-top'}: -1px;
    /* stylelint-enable */
    max-height: ${menuMaxHeight}px;
    position: absolute;
    top: auto;
    left: 0;
    bottom: ${openOuterUp ? '100%' : 'auto'};
    width: 100%;
    min-width: 70px;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
  }

  .Select-menu {
    max-height: ${menuMaxHeight - 2}px;
    overflow-y: auto;
  }

  .Select-option {
    box-sizing: border-box;
    background-color: ${theme.base00};
    color: ${theme.base07};
    cursor: pointer;
    display: block;
    padding: ${theme.inputHeight / 3}px;
    line-height: ${theme.inputInternalHeight / 2}px;

    &.is-selected {
      background-color: ${theme.base01};
      color: ${theme.base07};
    }

    &.is-focused {
      background-color: ${theme.base02};
      color: ${theme.base07};
    }

    &.is-disabled {
      color: ${theme.base05};
      cursor: default;
    }
  }

  .Select-noresults {
    box-sizing: border-box;
    color: ${theme.base06};
    background-color: ${theme.base00};
    cursor: default;
    display: block;
    padding: ${theme.inputPadding}px;
  }

  &.Select--multi {
    .Select-input {
      display: inline-block;
      vertical-align: middle;
      margin-left: ${theme.inputPadding}px;
      padding: 0;
    }

    &.has-value .Select-input {
      margin-left: ${theme.selectArrowWidth}px;
    }

    .Select-value {
      background-color: ${theme.base00};
      border-radius: ${theme.inputBorderRadius}px;
      border: 1px solid ${theme.base02};
      color: ${theme.base07};
      display: inline-block;
      font-size: 0.9em;
      margin-left: ${theme.inputPadding / 2}px;
      margin-top: 0;
      vertical-align: middle;
    }

    .Select-value-icon,
    .Select-value-label {
      display: inline-block;
      vertical-align: middle;
    }

    .Select-value-label {
      border-bottom-right-radius: ${theme.inputBorderRadius}px;
      border-top-right-radius: ${theme.inputBorderRadius}px;
      cursor: default;
      padding: ${Math.floor(theme.inputPadding / 4)}px
        ${Math.floor(theme.inputPadding / 2)}px;
    }

    a.Select-value-label {
      color: ${theme.base07};
      cursor: pointer;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .Select-value-icon {
      cursor: pointer;
      border-bottom-left-radius: ${theme.inputBorderRadius}px;
      border-top-left-radius: ${theme.inputBorderRadius}px;
      border-right: 1px solid ${theme.base02};
      padding: 0px ${Math.floor(theme.inputPadding / 2)}px;

      &:hover,
      &:focus {
        background-color: ${theme.base03};
        color: ${theme.base00};
      }

      &:active {
        background-color: ${theme.base06};
      }
    }
  }

  &.Select--multi.is-disabled {
    .Select-value {
      background-color: ${theme.base00};
      border: 1px solid ${theme.base01};
      color: ${theme.base05};
    }

    .Select-value-icon {
      cursor: not-allowed;
    }
  }
`;
