import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';
import dateformat from 'dateformat';
import debounce from 'lodash.debounce';
import RightSlider from './RightSlider';
import { StylingFunction } from 'react-base16-styling';
import { Action } from 'redux';

const BUTTON_SKIP = 'Skip';
const BUTTON_JUMP = 'Jump';

type Button = typeof BUTTON_SKIP | typeof BUTTON_JUMP;

interface Props<A extends Action<unknown>> {
  styling: StylingFunction;
  isSelected: boolean;
  action: A;
  actionId: number;
  isInitAction: boolean;
  onSelect: React.MouseEventHandler<HTMLDivElement> | undefined;
  timestamps: { current: number; previous: number };
  isSkipped: boolean;
  isInFuture: boolean;
  hideActionButtons: boolean | undefined;
  onToggleClick: () => void;
  onJumpClick: () => void;
  onCommitClick: () => void;
}

interface State {
  hover: boolean;
}

export default class ActionListRow<A extends Action<unknown>> extends Component<
  Props<A>,
  State
> {
  state = { hover: false };

  static propTypes = {
    styling: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    action: PropTypes.object.isRequired,
    isInFuture: PropTypes.bool.isRequired,
    isInitAction: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    timestamps: PropTypes.shape({
      current: PropTypes.number.isRequired,
      previous: PropTypes.number.isRequired
    }).isRequired,
    isSkipped: PropTypes.bool.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

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
      hideActionButtons
    } = this.props;
    const { hover } = this.state;
    const timeDelta = timestamps.current - timestamps.previous;
    const showButtons = (hover && !isInitAction) || isSkipped;

    const isButtonSelected = (btn: Button) => btn === BUTTON_SKIP && isSkipped;

    let actionType = action.type;
    if (typeof actionType === 'undefined') actionType = '<UNDEFINED>';
    else if (actionType === null) actionType = '<NULL>';
    else actionType = (actionType as string).toString() || '<EMPTY>';

    return (
      <div
        onClick={onSelect}
        onMouseEnter={
          (!hideActionButtons &&
            this.handleMouseEnter) as React.MouseEventHandler<HTMLDivElement>
        }
        onMouseLeave={
          (!hideActionButtons &&
            this.handleMouseLeave) as React.MouseEventHandler<HTMLDivElement>
        }
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseEnter}
        data-id={actionId}
        {...styling(
          [
            'actionListItem',
            isSelected && 'actionListItemSelected',
            isSkipped && 'actionListItemSkipped',
            isInFuture && 'actionListFromFuture'
          ],
          isSelected,
          action
        )}
      >
        <div
          {...styling([
            'actionListItemName',
            isSkipped && 'actionListItemNameSkipped'
          ])}
        >
          {actionType as string}
        </div>
        {hideActionButtons ? (
          <RightSlider styling={styling} shown>
            <div {...styling('actionListItemTime')}>
              {timeDelta === 0
                ? '+00:00:00'
                : dateformat(
                    timeDelta,
                    timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L'
                  )}
            </div>
          </RightSlider>
        ) : (
          <div {...styling('actionListItemButtons')}>
            <RightSlider styling={styling} shown={!showButtons} rotate>
              <div {...styling('actionListItemTime')}>
                {timeDelta === 0
                  ? '+00:00:00'
                  : dateformat(
                      timeDelta,
                      timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L'
                    )}
              </div>
            </RightSlider>
            <RightSlider styling={styling} shown={showButtons} rotate>
              <div {...styling('actionListItemSelector')}>
                {([BUTTON_JUMP, BUTTON_SKIP] as const).map(
                  btn =>
                    (!isInitAction || btn !== BUTTON_SKIP) && (
                      <div
                        key={btn}
                        onClick={e => this.handleButtonClick(btn, e)}
                        {...styling(
                          [
                            'selectorButton',
                            isButtonSelected(btn) && 'selectorButtonSelected',
                            'selectorButtonSmall'
                          ],
                          isButtonSelected(btn),
                          true
                        )}
                      >
                        {btn}
                      </div>
                    )
                )}
              </div>
            </RightSlider>
          </div>
        )}
      </div>
    );
  }

  handleButtonClick = (btn: Button, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    switch (btn) {
      case BUTTON_SKIP:
        this.props.onToggleClick();
        break;
      case BUTTON_JUMP:
        this.props.onJumpClick();
        break;
    }
  };

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.hover) return;
    this.handleMouseLeave.cancel();
    this.handleMouseEnterDebounced(e.buttons);
  };

  handleMouseEnterDebounced = debounce(buttons => {
    if (buttons) return;
    this.setState({ hover: true });
  }, 150);

  handleMouseLeave = debounce(() => {
    this.handleMouseEnterDebounced.cancel();
    if (this.state.hover) this.setState({ hover: false });
  }, 100);

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      ((e.target as unknown) as { className: string[] }).className.indexOf(
        'selectorButton'
      ) === 0
    )
      return;
    this.handleMouseLeave();
  };
}
