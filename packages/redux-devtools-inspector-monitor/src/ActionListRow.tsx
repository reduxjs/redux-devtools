import React, { MouseEvent, MouseEventHandler, PureComponent } from 'react';
import dateformat from 'dateformat';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { Action } from 'redux';
import type { Interpolation, Theme } from '@emotion/react';
import type { JSX } from '@emotion/react/jsx-runtime';
import RightSlider from './RightSlider';
import {
  selectorButtonCss,
  selectorButtonSelectedCss,
  selectorButtonSmallCss,
} from './utils/selectorButtonStyles';

const BUTTON_SKIP = 'Skip';
const BUTTON_JUMP = 'Jump';

type Button = typeof BUTTON_SKIP | typeof BUTTON_JUMP;

const actionListItemTimeCss: Interpolation<Theme> = (theme) => ({
  display: 'inline',
  padding: '4px 6px',
  borderRadius: '3px',
  fontSize: '0.8em',
  lineHeight: '1em',
  flexShrink: 0,

  backgroundColor: theme.ACTION_TIME_BACK_COLOR,
  color: theme.ACTION_TIME_COLOR,
});

interface Props<A extends Action<string>> {
  actionId: number;
  isInitAction: boolean;
  isSelected: boolean;
  isInFuture: boolean;
  onSelect: MouseEventHandler<HTMLDivElement>;
  timestamps: { current: number; previous: number };
  action: A;
  onToggleClick: () => void;
  onJumpClick: () => void;
  onCommitClick: () => void;
  hideActionButtons: boolean | undefined;
  isSkipped: boolean;
}

interface State {
  hover: boolean;
}

export default class ActionListRow<
  A extends Action<string>,
> extends PureComponent<Props<A>, State> {
  state: State = { hover: false };

  render(): JSX.Element {
    const {
      isSelected,
      action,
      actionId,
      isInitAction,
      onSelect,
      timestamps,
      isSkipped,
      isInFuture,
      hideActionButtons,
    } = this.props;
    const { hover } = this.state;
    const timeDelta = timestamps.current - timestamps.previous;
    const showButtons = (hover && !isInitAction) || isSkipped;

    const isButtonSelected = (btn: Button) => btn === BUTTON_SKIP && isSkipped;

    let actionType = action.type;
    if (typeof actionType === 'undefined') actionType = '<UNDEFINED>';
    else if (actionType === null) actionType = '<NULL>';
    else actionType = actionType.toString() || '<EMPTY>';

    return (
      <div
        onClick={onSelect}
        onMouseEnter={
          (!hideActionButtons &&
            this.handleMouseEnter) as MouseEventHandler<HTMLDivElement>
        }
        onMouseLeave={
          (!hideActionButtons &&
            this.handleMouseLeave) as MouseEventHandler<HTMLDivElement>
        }
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseEnter}
        data-id={actionId}
        css={[
          (theme) => ({
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '5px 10px',
            cursor: 'pointer',
            userSelect: 'none',

            borderBottomColor: theme.BORDER_COLOR,
          }),
          isSelected &&
            ((theme) => ({
              backgroundColor: theme.SELECTED_BACKGROUND_COLOR,
            })),
          isSkipped &&
            ((theme) => ({
              backgroundColor: theme.SKIPPED_BACKGROUND_COLOR,
            })),
          isInFuture && { opacity: '0.6' },
        ]}
      >
        <div
          css={[
            {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '20px',
            },
            isSkipped && { textDecoration: 'line-through', opacity: 0.3 },
          ]}
        >
          {actionType}
        </div>
        {hideActionButtons ? (
          <RightSlider shown>
            <div css={actionListItemTimeCss}>
              {timeDelta === 0
                ? '+00:00:00'
                : dateformat(
                    timeDelta,
                    timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L',
                  )}
            </div>
          </RightSlider>
        ) : (
          <div css={{ position: 'relative', height: '20px', display: 'flex' }}>
            <RightSlider shown={!showButtons} rotate>
              <div css={actionListItemTimeCss}>
                {timeDelta === 0
                  ? '+00:00:00'
                  : dateformat(
                      timeDelta,
                      timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L',
                    )}
              </div>
            </RightSlider>
            <RightSlider shown={showButtons} rotate>
              <div css={{ display: 'inline-flex' }}>
                {([BUTTON_JUMP, BUTTON_SKIP] as const).map(
                  (btn) =>
                    (!isInitAction || btn !== BUTTON_SKIP) && (
                      <div
                        key={btn}
                        onClick={(e) => this.handleButtonClick(btn, e)}
                        css={[
                          selectorButtonCss,
                          isButtonSelected(btn) && selectorButtonSelectedCss,
                          selectorButtonSmallCss,
                        ]}
                        data-isselectorbutton={true}
                      >
                        {btn}
                      </div>
                    ),
                )}
              </div>
            </RightSlider>
          </div>
        )}
      </div>
    );
  }

  handleButtonClick(btn: Button, e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    switch (btn) {
      case BUTTON_SKIP:
        this.props.onToggleClick();
        break;
      case BUTTON_JUMP:
        this.props.onJumpClick();
        break;
    }
  }

  handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (this.state.hover) return;
    this.handleMouseLeave.cancel();
    this.handleMouseEnterDebounced(e.buttons);
  };

  handleMouseEnterDebounced: DebouncedFunc<(buttons: number) => void> =
    debounce((buttons) => {
      if (buttons) return;
      this.setState({ hover: true });
    }, 150);

  handleMouseLeave: DebouncedFunc<() => void> = debounce(() => {
    this.handleMouseEnterDebounced.cancel();
    if (this.state.hover) this.setState({ hover: false });
  }, 100);

  handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.isselectorbutton) return;
    this.handleMouseLeave();
  };
}
