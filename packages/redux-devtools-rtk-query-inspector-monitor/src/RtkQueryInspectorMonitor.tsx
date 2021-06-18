import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Action } from 'redux';
import RtkQueryInspector from './RtkQueryInspector';
import { reducer } from './reducers';
import {
  ExternalProps,
  RtkQueryInspectorMonitorProps,
  RtkQueryInspectorMonitorState,
  StyleUtils,
} from './types';
import {
  createThemeState,
  StyleUtilsContext,
} from './styles/createStylingFromTheme';

interface DefaultProps {
  theme: string;
  invertTheme: boolean;
}

export interface RtkQueryInspectorComponentState {
  readonly styleUtils: StyleUtils;
}

class RtkQueryInspectorMonitor<S, A extends Action<unknown>> extends Component<
  RtkQueryInspectorMonitorProps<S, A>,
  RtkQueryInspectorComponentState
> {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    currentStateIndex: PropTypes.number,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.object,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    invertTheme: PropTypes.bool,
  };

  static defaultProps = {
    theme: 'nicinabox',
    invertTheme: false,
  };

  constructor(props: RtkQueryInspectorMonitorProps<S, A>) {
    super(props);

    this.state = {
      styleUtils: createThemeState<S, A>(props),
    };
  }

  render() {
    const {
      styleUtils: { base16Theme },
    } = this.state;

    const RtkQueryInspectorAsAny = RtkQueryInspector as any;

    return (
      <StyleUtilsContext.Provider value={this.state.styleUtils}>
        <RtkQueryInspectorAsAny
          {...this.props}
          theme={base16Theme}
          styleUtils={this.state.styleUtils}
        />
      </StyleUtilsContext.Provider>
    );
  }
}

export default RtkQueryInspectorMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<unknown>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<unknown>>,
    state: RtkQueryInspectorMonitorState | undefined,
    action: Action
  ): RtkQueryInspectorMonitorState;
  defaultProps: DefaultProps;
};
