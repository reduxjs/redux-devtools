import React, { Component, PureComponent } from 'react';
import { Action, Dispatch } from 'redux';
import { base16Themes } from 'react-base16-styling';
import type { Base16Theme } from 'react-base16-styling';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import {
  Button,
  Divider,
  SegmentedControl,
  Slider,
  Toolbar,
} from '@redux-devtools/ui';

import reducer from './reducers';
import SliderButton from './SliderButton';

const { reset, jumpToAction } = ActionCreators;

interface ExternalProps<S, A extends Action<string>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Dispatch<LiftedAction<S, A, {}>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  keyboardEnabled: boolean;
  hideResetButton?: boolean;
}

interface DefaultProps {
  select: (state: unknown) => unknown;
  theme: keyof typeof base16Themes;
  preserveScrollTop: boolean;
  keyboardEnabled: boolean;
}

interface SliderMonitorProps<S, A extends Action<string>> // eslint-disable-next-line @typescript-eslint/ban-types
  extends LiftedState<S, A, {}> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Dispatch<LiftedAction<S, A, {}>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  keyboardEnabled: boolean;
  hideResetButton?: boolean;
}

interface State {
  timer: number | undefined;
  replaySpeed: string;
}

class SliderMonitor<S, A extends Action<string>> extends (PureComponent ||
  Component)<SliderMonitorProps<S, A>, State> {
  static update = reducer;

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
      if (typeof base16Themes[this.props.theme] !== 'undefined') {
        theme = base16Themes[this.props.theme];
      } else {
        theme = base16Themes.nicinabox;
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

    this.props.dispatch(jumpToAction(this.props.stagedActionIds[value]));
  };

  startReplay = () => {
    const { computedStates, currentStateIndex, dispatch, stagedActionIds } =
      this.props;

    if (computedStates.length < 2) {
      return;
    }
    const speed = this.state.replaySpeed === '1x' ? 500 : 200;

    let stateIndex;
    if (currentStateIndex === computedStates.length - 1) {
      dispatch(jumpToAction(stagedActionIds[0]));
      stateIndex = 0;
    } else if (currentStateIndex === computedStates.length - 2) {
      dispatch(jumpToAction(stagedActionIds[currentStateIndex + 1]));
      return;
    } else {
      stateIndex = currentStateIndex + 1;
      dispatch(jumpToAction(stagedActionIds[currentStateIndex + 1]));
    }

    let counter = stateIndex;
    const timer = window.setInterval(() => {
      if (counter + 1 <= computedStates.length - 1) {
        dispatch(jumpToAction(stagedActionIds[counter + 1]));
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
      this.props.dispatch(jumpToAction(this.props.stagedActionIds[0]));

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
        this.props.dispatch(
          jumpToAction(
            this.props.stagedActionIds[this.props.currentStateIndex + 1],
          ),
        );

        if (
          this.props.currentStateIndex >=
          this.props.computedStates.length - 1
        ) {
          this.pauseReplay();
          return;
        }

        timestampDiff = this.getLatestTimestampDiff(
          this.props.currentStateIndex,
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
        },
      );
    }
  };

  stepLeft = () => {
    this.pauseReplay();

    if (this.props.currentStateIndex !== 0) {
      this.props.dispatch(
        jumpToAction(
          this.props.stagedActionIds[this.props.currentStateIndex - 1],
        ),
      );
    }
  };

  stepRight = () => {
    this.pauseReplay();

    if (this.props.currentStateIndex !== this.props.computedStates.length - 1) {
      this.props.dispatch(
        jumpToAction(
          this.props.stagedActionIds[this.props.currentStateIndex + 1],
        ),
      );
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
    else actionType = actionType.toString() || '<EMPTY>';

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
          label={actionType}
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
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    state: {} | undefined,
    action: Action<string>,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): {};
  defaultProps: DefaultProps;
};
