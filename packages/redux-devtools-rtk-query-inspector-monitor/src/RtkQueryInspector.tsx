import React, { Component, createRef, ReactNode } from 'react';
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
import { QueryPreview } from './components/QueryPreview';

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

type RtkQueryInspectorState<S> = {
  selectorsSource: SelectorsSource<S>;
  isWideLayout: boolean;
};

class RtkQueryInspector<S, A extends Action<unknown>> extends Component<
  RtkQueryInspectorProps<S, A>,
  RtkQueryInspectorState<S>
> {
  inspectorRef = createRef<HTMLDivElement>();

  isWideIntervalRef: number | NodeJS.Timeout | null = null;

  constructor(props: RtkQueryInspectorProps<S, A>) {
    super(props);

    this.state = {
      isWideLayout: true,
      selectorsSource: computeSelectorSource(props, null),
    };
  }

  static wideLayout = 500;

  static getDerivedStateFromProps(
    props: RtkQueryInspectorProps<unknown, Action<unknown>>,
    state: RtkQueryInspectorState<unknown>
  ): null | Partial<RtkQueryInspectorState<unknown>> {
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

  updateSizeMode = (): void => {
    if (this.inspectorRef.current) {
      const isWideLayout =
        this.inspectorRef.current.offsetWidth > RtkQueryInspector.wideLayout;

      if (isWideLayout !== this.state.isWideLayout) {
        this.setState({ isWideLayout });
      }
    }
  };

  componentDidMount() {
    this.updateSizeMode();

    this.isWideIntervalRef = setInterval(this.updateSizeMode, 200);
  }

  componentWillUnmount() {
    if (this.isWideIntervalRef) {
      clearTimeout(this.isWideIntervalRef as any);
    }
  }

  handleSelectQuery = (queryInfo: QueryInfo): void => {
    this.props.dispatch(selectQueryKey(queryInfo) as AnyAction);
  };

  render(): ReactNode {
    const { selectorsSource, isWideLayout } = this.state;
    const {
      styleUtils: { styling },
    } = this.props;
    const apiStates = this.selectors.selectApiStates(selectorsSource);
    const allSortedQueries = this.selectors.selectAllSortedQueries(
      selectorsSource
    );

    const currentQueryInfo = this.selectors.selectorCurrentQueryInfo(
      selectorsSource
    );

    console.log('inspector', {
      apiStates,
      allSortedQueries,
      selectorsSource,
      currentQueryInfo,
    });

    return (
      <div
        ref={this.inspectorRef}
        data-wide-layout={+this.state.isWideLayout}
        {...styling('inspector')}
      >
        <div
          {...styling('querySectionWrapper')}
          data-wide-layout={+this.state.isWideLayout}
        >
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
        <QueryPreview
          selectedQueryInfo={currentQueryInfo}
          styling={styling}
          isWideLayout={isWideLayout}
        />
      </div>
    );
  }
}

export default RtkQueryInspector;
