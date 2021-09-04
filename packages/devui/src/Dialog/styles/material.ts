import { css, ThemedStyledProps } from 'styled-components';
import { StyleProps } from './default';
import { Theme } from '../../themes/default';

export const style = ({
  theme,
  open,
  fullWidth,
}: ThemedStyledProps<StyleProps, Theme>) => css`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 14;
  display: ${open ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div:first-child {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: ${theme.base05};
    opacity: 0.3;
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    z-index: 12;
    max-height: 100%;
    min-width: 320px;
    ${fullWidth ? 'width: 99%;' : ''}
    padding: 16px;
    margin-bottom: 16px;
    border: none;
    background-color: ${theme.base00};
    box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.14),
      0 11px 15px -7px rgba(0, 0, 0, 0.12), 0 24px 38px 3px rgba(0, 0, 0, 0.2);

    > div.mc-dialog--header {
      display: flex;
      align-items: center;
      font-size: 20px;
      margin: -17px -17px 6px;
      padding: 16px;
      border: none;

      > div:first-child {
        flex-grow: 1;
      }

      > button {
        box-sizing: border-box;
        font-size: 1em;
        line-height: 1;
        font-weight: bold;
        margin: 0px;
        padding: 0px 5px;
        cursor: pointer;
        color: inherit;
        background-color: transparent;
        border: 0px;
        -webkit-appearance: none;
        outline: none;
      }
    }

    > div.mc-dialog--body {
      overflow: auto;

      > form {
        padding: 0;

        > .form-group {
          margin-bottom: 0;
        }

        > div > fieldset {
          legend {
            display: none;
          }
          #root__description {
            margin-top: 0;
          }
        }

        .mc-dialog--hidden {
          display: none;
        }
      }
    }

    > div.mc-dialog--footer {
      min-height: 45px;
      box-sizing: border-box;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: 16px -16px -16px;
      padding: 2px 10px;

      > button {
        box-shadow: none;
      }
    }
  }
`;
