import React, { Component } from 'react';
import { Action, AnyAction } from 'redux';
import { ThemeProvider } from '@emotion/react';
import RtkQueryInspector from './RtkQueryInspector';
import { reducer } from '../reducers';
import {
  ExternalProps,
  RtkQueryMonitorProps,
  RtkQueryMonitorState,
} from '../types';
import {
  createRtkQueryMonitorThemeFromBase16Theme,
  resolveBase16Theme,
  StyleUtilsContext,
} from '../styles/themes';

interface DefaultProps {
  theme: string;
  invertTheme: boolean;
}

class RtkQueryMonitor<S, A extends Action<string>> extends Component<
  RtkQueryMonitorProps<S, A>
> {
  static update = reducer;

  static defaultProps: DefaultProps = {
    theme: 'nicinabox',
    invertTheme: false,
  };

  render() {
    const {
      currentStateIndex,
      computedStates,
      monitorState,
      dispatch,
      actionsById,
      theme,
      invertTheme,
    } = this.props;

    const base16Theme = resolveBase16Theme(theme);
    const styleUtils = { base16Theme, invertTheme };
    const rtkQueryMonitorTheme = createRtkQueryMonitorThemeFromBase16Theme(
      base16Theme,
      invertTheme,
    );

    return (
      <StyleUtilsContext.Provider value={styleUtils}>
        <ThemeProvider theme={rtkQueryMonitorTheme}>
          <RtkQueryInspector<S, AnyAction>
            computedStates={computedStates}
            currentStateIndex={currentStateIndex}
            monitorState={monitorState}
            dispatch={dispatch}
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
