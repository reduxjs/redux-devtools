import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import * as themes from 'redux-devtools-themes';
import { Base16Theme } from 'redux-devtools-themes';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import { Toolbar, Divider } from '@redux-devtools/ui/lib/Toolbar';
import Slider from '@redux-devtools/ui/lib/Slider';
import Button from '@redux-devtools/ui/lib/Button';
import SegmentedControl from '@redux-devtools/ui/lib/SegmentedControl';

import reducer from './reducers';
import SliderButton from './SliderButton';

// eslint-disable-next-line @typescript-eslint/unbound-method
const { reset, jumpToState } = ActionCreators;

interface ExternalProps<S, A extends Action<unknown>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Dispatch<LiftedAction<S, A, {}>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  keyboardEnabled: boolean;
  hideResetButton?: boolean;
}

interface DefaultProps {
  select: (state: unknown) => unknown;
  theme: keyof typeof themes;
  preserveScrollTop: boolean;
  keyboardEnabled: boolean;
}

interface SliderMonitorProps<S, A extends Action<unknown>> // eslint-disable-next-line @typescript-eslint/ban-types
  extends LiftedState<S, A, {}> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Dispatch<LiftedAction<S, A, {}>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  keyboardEnabled: boolean;
  hideResetButton?: boolean;
}

interface State {
  timer: number | undefined;
  replaySpeed: string;
}

class SliderMonitor<S, A extends Action<unknown>> extends (PureComponent ||
  Component)<SliderMonitorProps<S, A>, State> {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    actionsById: PropTypes.object,
    currentStateIndex: PropTypes.number,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number,
    }),
    preserveScrollTop: PropTypes.bool,
    // stagedActions: PropTypes.array,
    select: PropTypes.func.isRequired,
    hideResetButton: PropTypes.bool,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    keyboardEnabled: PropTypes.bool,
  };

  static defaultProps = {
    select: (state: unknown) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    keyboardEnabled: true,
  };

  state: State = {
    timer: undefined,
    replaySpeed: '1x',
  };

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  setUpTheme = (): Base16Theme => {
    let theme;
    if (typeof this.props.theme === 'string') {
      if (typeof themes[this.props.theme] !== 'undefined') {
        theme = themes[this.props.theme];
      } else {
        theme = themes.nicinabox;
      }
    } else {
      theme = this.props.theme;
    }

    return theme;
  };

  handleReset = () => {
    this.pauseReplay();
    this.props.dispatch(reset());
  };

  handleKeyPress = (event: KeyboardEvent) => {
    if (!this.props.keyboardEnabled) {
      return null;
    }
    if (event.ctrlKey && event.keyCode === 74) {
      // ctrl+j
      event.preventDefault();

      if (this.state.timer) {
        return this.pauseReplay();
      }

      if (this.state.replaySpeed === 'Live') {
        this.startRealtimeReplay();
      } else {
        this.startReplay();
      }
    } else if (event.ctrlKey && event.keyCode === 219) {
      // ctrl+[
      event.preventDefault();
      this.stepLeft();
    } else if (event.ctrlKey && event.keyCode === 221) {
      // ctrl+]
      event.preventDefault();
      this.stepRight();
    }
    return null;
  };

  handleSliderChange = (value: number) => {
    if (this.state.timer) {
      this.pauseReplay();
    }

    this.props.dispatch(jumpToState(value));
  };

  startReplay = () => {
    const { computedStates, currentStateIndex, dispatch } = this.props;

    if (computedStates.length < 2) {
      return;
    }
    const speed = this.state.replaySpeed === '1x' ? 500 : 200;

    let stateIndex;
    if (currentStateIndex === computedStates.length - 1) {
      dispatch(jumpToState(0));
      stateIndex = 0;
    } else if (currentStateIndex === computedStates.length - 2) {
      dispatch(jumpToState(currentStateIndex + 1));
      return;
    } else {
      stateIndex = currentStateIndex + 1;
      dispatch(jumpToState(currentStateIndex + 1));
    }

    let counter = stateIndex;
    const timer = window.setInterval(() => {
      if (counter + 1 <= computedStates.length - 1) {
        dispatch(jumpToState(counter + 1));
      }
      counter += 1;

      if (counter >= computedStates.length - 1) {
        clearInterval(this.state.timer);
        this.setState({
          timer: undefined,
        });
      }
    }, speed);

    this.setState({ timer });
  };

  startRealtimeReplay = () => {
    if (this.props.computedStates.length < 2) {
      return;
    }

    if (this.props.currentStateIndex === this.props.computedStates.length - 1) {
      this.props.dispatch(jumpToState(0));

      this.loop(0);
    } else {
      this.loop(this.props.currentStateIndex);
    }
  };

  loop = (index: number) => {
    let currentTimestamp = Date.now();
    let timestampDiff = this.getLatestTimestampDiff(index);

    const aLoop = () => {
      const replayDiff = Date.now() - currentTimestamp;
      if (replayDiff >= timestampDiff) {
        this.props.dispatch(jumpToState(this.props.currentStateIndex + 1));

        if (
          this.props.currentStateIndex >=
          this.props.computedStates.length - 1
        ) {
          this.pauseReplay();
          return;
        }

        timestampDiff = this.getLatestTimestampDiff(
          this.props.currentStateIndex
        );
        currentTimestamp = Date.now();

        this.setState({
          timer: requestAnimationFrame(aLoop),
        });
      } else {
        this.setState({
          timer: requestAnimationFrame(aLoop),
        });
      }
    };

    if (index !== this.props.computedStates.length - 1) {
      this.setState({
        timer: requestAnimationFrame(aLoop),
      });
    }
  };

  getLatestTimestampDiff = (index: number) =>
    this.getTimestampOfStateIndex(index + 1) -
    this.getTimestampOfStateIndex(index);

  getTimestampOfStateIndex = (stateIndex: number) => {
    const id = this.props.stagedActionIds[stateIndex];
    return this.props.actionsById[id].timestamp;
  };

  pauseReplay = (cb?: () => void) => {
    if (this.state.timer) {
      cancelAnimationFrame(this.state.timer);
      clearInterval(this.state.timer);
      this.setState(
        {
          timer: undefined,
        },
        () => {
          if (typeof cb === 'function') {
            cb();
          }
        }
      );
    }
  };

  stepLeft = () => {
    this.pauseReplay();

    if (this.props.currentStateIndex !== 0) {
      this.props.dispatch(jumpToState(this.props.currentStateIndex - 1));
    }
  };

  stepRight = () => {
    this.pauseReplay();

    if (this.props.currentStateIndex !== this.props.computedStates.length - 1) {
      this.props.dispatch(jumpToState(this.props.currentStateIndex + 1));
    }
  };

  changeReplaySpeed = (replaySpeed: string) => {
    this.setState({ replaySpeed });

    if (this.state.timer) {
      this.pauseReplay(() => {
        if (replaySpeed === 'Live') {
          this.startRealtimeReplay();
        } else {
          this.startReplay();
        }
      });
    }
  };

  render() {
    const {
      currentStateIndex,
      computedStates,
      actionsById,
      stagedActionIds,
      hideResetButton,
    } = this.props;
    const { replaySpeed } = this.state;
    const theme = this.setUpTheme();

    const max = computedStates.length - 1;
    const actionId = stagedActionIds[currentStateIndex];
    let actionType = actionsById[actionId].action.type;
    if (actionType === undefined) actionType = '<UNDEFINED>';
    else if (actionType === null) actionType = '<NULL>';
    else actionType = (actionType as string).toString() || '<EMPTY>';

    const onPlayClick =
      replaySpeed === 'Live' ? this.startRealtimeReplay : this.startReplay;
    const playPause = this.state.timer ? (
      <SliderButton theme={theme} type="pause" onClick={this.pauseReplay} />
    ) : (
      <SliderButton
        theme={theme}
        type="play"
        disabled={max <= 0}
        onClick={onPlayClick}
      />
    );

    return (
      <Toolbar noBorder compact fullHeight theme={theme}>
        {playPause}
        <Slider
          label={actionType as string}
          sublabel={`(${actionId})`}
          min={0}
          max={max}
          value={currentStateIndex}
          onChange={this.handleSliderChange}
          theme={theme}
        />
        <SliderButton
          theme={theme}
          type="stepLeft"
          disabled={currentStateIndex <= 0}
          onClick={this.stepLeft}
        />
        <SliderButton
          theme={theme}
          type="stepRight"
          disabled={currentStateIndex === max}
          onClick={this.stepRight}
        />
        <Divider theme={theme} />
        <SegmentedControl
          theme={theme}
          values={['Live', '1x', '2x']}
          selected={replaySpeed}
          onClick={this.changeReplaySpeed}
        />
        {!hideResetButton && [
          <Divider key="divider" theme={theme} />,
          <Button key="reset" theme={theme} onClick={this.handleReset}>
            Reset
          </Button>,
        ]}
      </Toolbar>
    );
  }
}

export default SliderMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<unknown>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<unknown>>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    state: {} | undefined,
    action: Action<unknown>
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): {};
  defaultProps: DefaultProps;
};
