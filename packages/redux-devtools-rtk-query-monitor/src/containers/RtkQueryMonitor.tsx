import React, { Component } from 'react';
import { Action, AnyAction } from 'redux';
import RtkQueryInspector from './RtkQueryInspector';
import { reducer } from '../reducers';
import {
  ExternalProps,
  RtkQueryMonitorProps,
  RtkQueryMonitorState,
  StyleUtils,
} from '../types';
import {
  colorMap,
  createThemeState,
  StyleUtilsContext,
} from '../styles/createStylingFromTheme';
import { ThemeProvider } from '@emotion/react';
import {
  getBase16Theme,
  invertBase16Theme,
  invertTheme,
} from 'react-base16-styling';
import * as reduxThemes from 'redux-devtools-themes';

interface DefaultProps {
  theme: string;
  invertTheme: boolean;
}

export interface RtkQueryComponentState {
  readonly styleUtils: StyleUtils;
}

class RtkQueryMonitor<S, A extends Action<string>> extends Component<
  RtkQueryMonitorProps<S, A>,
  RtkQueryComponentState
> {
  static update = reducer;

  static defaultProps: DefaultProps = {
    theme: 'nicinabox',
    invertTheme: false,
  };

  constructor(props: RtkQueryMonitorProps<S, A>) {
    super(props);

    this.state = {
      styleUtils: createThemeState<S, A>(props),
    };
  }

  render() {
    const {
      currentStateIndex,
      computedStates,
      monitorState,
      dispatch,
      actionsById,
    } = this.props;

    // TODO Cleanup
    const base16Theme =
      getBase16Theme(this.props.theme, { ...reduxThemes }) ??
      reduxThemes.nicinabox;
    const theme = this.props.invertTheme
      ? invertBase16Theme(base16Theme)
      : base16Theme;

    return (
      <StyleUtilsContext.Provider value={this.state.styleUtils}>
        <ThemeProvider theme={colorMap(theme)}>
          <RtkQueryInspector<S, AnyAction>
            computedStates={computedStates}
            currentStateIndex={currentStateIndex}
            monitorState={monitorState}
            dispatch={dispatch}
            styleUtils={this.state.styleUtils}
            actionsById={actionsById}
          />
        </ThemeProvider>
      </StyleUtilsContext.Provider>
    );
  }
}

export default RtkQueryMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    state: RtkQueryMonitorState | undefined,
    action: Action,
  ): RtkQueryMonitorState;
  defaultProps: DefaultProps;
};
