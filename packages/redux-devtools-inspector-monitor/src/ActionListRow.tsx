import React, { MouseEvent, MouseEventHandler, PureComponent } from 'react';
import dateformat from 'dateformat';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { StylingFunction } from 'react-base16-styling';
import { Action } from 'redux';
import RightSlider from './RightSlider';
import {
  actionListFromFutureCss,
  actionListItemButtonsCss,
  actionListItemCss,
  actionListItemNameCss,
  actionListItemNameSkippedCss,
  actionListItemSelectedCss,
  actionListItemSelectorCss,
  actionListItemSkippedCss,
  actionListItemTimeCss,
} from './utils/createStylingFromTheme';

const BUTTON_SKIP = 'Skip';
const BUTTON_JUMP = 'Jump';

type Button = typeof BUTTON_SKIP | typeof BUTTON_JUMP;

interface Props<A extends Action<string>> {
  styling: StylingFunction;
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

  render() {
    const {
      styling,
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
          actionListItemCss,
          isSelected && actionListItemSelectedCss,
          isSkipped && actionListItemSkippedCss,
          isInFuture && actionListFromFutureCss,
        ]}
      >
        <div
          css={[
            actionListItemNameCss,
            isSkipped && actionListItemNameSkippedCss,
          ]}
        >
          {actionType}
        </div>
        {hideActionButtons ? (
          <RightSlider styling={styling} shown>
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
          <div css={actionListItemButtonsCss}>
            <RightSlider styling={styling} shown={!showButtons} rotate>
              <div css={actionListItemTimeCss}>
                {timeDelta === 0
                  ? '+00:00:00'
                  : dateformat(
                      timeDelta,
                      timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L',
                    )}
              </div>
            </RightSlider>
            <RightSlider styling={styling} shown={showButtons} rotate>
              <div css={actionListItemSelectorCss}>
                {([BUTTON_JUMP, BUTTON_SKIP] as const).map(
                  (btn) =>
                    (!isInitAction || btn !== BUTTON_SKIP) && (
                      <div
                        key={btn}
                        onClick={(e) => this.handleButtonClick(btn, e)}
                        {...styling(
                          [
                            'selectorButton',
                            isButtonSelected(btn) && 'selectorButtonSelected',
                            'selectorButtonSmall',
                          ],
                          isButtonSelected(btn),
                          true,
                        )}
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
    if (
      (e.target as unknown as { className: string[] }).className.indexOf(
        'selectorButton',
      ) === 0
    )
      return;
    this.handleMouseLeave();
  };
}
