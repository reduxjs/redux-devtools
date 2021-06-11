import React, { Component, createRef, CSSProperties, ReactNode } from 'react';
import { AnyAction, Dispatch, Action } from 'redux';
import { LiftedAction, LiftedState } from '@redux-devtools/core';
import * as themes from 'redux-devtools-themes';
import { Base16Theme } from 'react-base16-styling';
import { QueryInfo, RtkQueryInspectorMonitorState } from './types';
import { createInspectorSelectors, computeSelectorSource } from './selectors';
import { selectQueryKey } from './reducers';
import { QueryList } from './components/QueryList';
import { StyleUtils } from './styles/createStylingFromTheme';
import { QueryForm } from './components/QueryForm';

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
};

type SelectorsSource<S> = {
  currentState: S | null;
  monitorState: RtkQueryInspectorMonitorState;
};

export interface RtkQueryInspectorProps<S, A extends Action<unknown>>
  extends LiftedState<S, A, RtkQueryInspectorMonitorState> {
  dispatch: Dispatch<LiftedAction<S, A, RtkQueryInspectorMonitorState>>;
  theme: keyof typeof themes | Base16Theme;
  invertTheme: boolean;
  state: S | null;
  styleUtils: StyleUtils;
}

type RtkQueryInspectorState<S> = { selectorsSource: SelectorsSource<S> };

class RtkQueryInspector<S, A extends Action<unknown>> extends Component<
  RtkQueryInspectorProps<S, A>,
  RtkQueryInspectorState<S>
> {
  divRef = createRef<HTMLDivElement>();

  constructor(props: RtkQueryInspectorProps<S, A>) {
    super(props);

    this.state = {
      selectorsSource: computeSelectorSource(props, null),
    };
  }

  static getDerivedStateFromProps(
    props: RtkQueryInspectorProps<unknown, Action<unknown>>,
    state: RtkQueryInspectorState<unknown>
  ): null | RtkQueryInspectorState<unknown> {
    const selectorsSource = computeSelectorSource<unknown, Action<unknown>>(
      props,
      state.selectorsSource
    );

    if (selectorsSource !== state.selectorsSource) {
      return {
        selectorsSource,
      };
    }

    return null;
  }

  selectors = createInspectorSelectors<S>();

  handleSelectQuery = (queryInfo: QueryInfo) => {
    this.props.dispatch(selectQueryKey(queryInfo) as AnyAction);
  };

  render(): ReactNode {
    const { selectorsSource } = this.state;
    const {
      styleUtils: { styling },
    } = this.props;
    const apiStates = this.selectors.selectApiStates(selectorsSource);
    const allSortedQueries = this.selectors.selectAllSortedQueries(
      selectorsSource
    );

    console.log('inspector', { apiStates, allSortedQueries, selectorsSource });

    return (
      <div style={wrapperStyle} ref={this.divRef}>
        <div {...styling('querySectionWrapper')}>
          <QueryForm
            dispatch={this.props.dispatch}
            queryComparator={selectorsSource.monitorState.queryComparator}
            isAscendingQueryComparatorOrder={
              selectorsSource.monitorState.isAscendingQueryComparatorOrder
            }
          />
          <QueryList
            onSelectQuery={this.handleSelectQuery}
            queryInfos={allSortedQueries}
            selectedQueryKey={selectorsSource.monitorState.selectedQueryKey}
          />
        </div>
      </div>
    );
  }
}

export default RtkQueryInspector;
