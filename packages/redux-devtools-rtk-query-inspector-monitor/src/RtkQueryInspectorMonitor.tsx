import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as themes from 'redux-devtools-themes';
import { Action } from 'redux';
import { Base16Theme } from 'react-base16-styling';
import RtkQueryInspector from './RtkQueryInspector';
import reducer from './reducers';
import {
  ExternalProps,
  RtkQueryInspectorMonitorProps,
  RtkQueryInspectorMonitorState,
} from './types';
import {
  createThemeState,
  StyleUtils,
  StyleUtilsContext,
} from './styles/createStylingFromTheme';
interface DefaultProps<S> {
  select: (state: unknown) => unknown;
  theme: keyof typeof themes | Base16Theme;
  preserveScrollTop: boolean;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
}

export interface RtkQueryInspectorComponentState {
  readonly styleUtils: StyleUtils;
}

class RtkQueryInspectorMonitor<
  S,
  A extends Action<unknown>
> extends PureComponent<
  RtkQueryInspectorMonitorProps<S, A>,
  RtkQueryInspectorComponentState
> {
  constructor(props: RtkQueryInspectorMonitorProps<S, A>) {
    super(props);

    this.state = {
      styleUtils: createThemeState<S, A>(props),
    };
  }

  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    currentStateIndex: PropTypes.number,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number,
    }),

    preserveScrollTop: PropTypes.bool,
    select: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    invertTheme: PropTypes.bool,
  };

  static defaultProps: DefaultProps<unknown> = {
    select: (state: unknown) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    expandActionRoot: true,
    expandStateRoot: true,
    markStateDiff: false,
  };

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

export default (RtkQueryInspectorMonitor as unknown) as React.ComponentType<
  ExternalProps<unknown, Action<unknown>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<unknown>>,
    state: RtkQueryInspectorMonitorState | undefined,
    action: Action
  ): RtkQueryInspectorMonitorState;
  defaultProps: DefaultProps<unknown>;
};
