import React, { Component, createRef, ReactNode } from 'react';
import { AnyAction, Dispatch, Action } from 'redux';
import { LiftedAction, LiftedState } from '@redux-devtools/core';
import * as themes from 'redux-devtools-themes';
import { Base16Theme } from 'react-base16-styling';
import {
  QueryFormValues,
  QueryInfo,
  QueryPreviewTabs,
  RtkQueryInspectorMonitorState,
  StyleUtils,
} from './types';
import { createInspectorSelectors, computeSelectorSource } from './selectors';
import {
  changeQueryFormValues,
  selectedPreviewTab,
  selectQueryKey,
} from './reducers';
import { QueryList } from './components/QueryList';
import { QueryForm } from './components/QueryForm';
import { QueryPreview } from './components/QueryPreview';
import { getApiStateOf, getQuerySubscriptionsOf } from './utils/rtk-query';

type SelectorsSource<S> = {
  userState: S | null;
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

  static wideLayout = 650;

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

  componentDidMount(): void {
    this.updateSizeMode();

    this.isWideIntervalRef = setInterval(this.updateSizeMode, 300);
  }

  componentWillUnmount(): void {
    if (this.isWideIntervalRef) {
      clearTimeout(this.isWideIntervalRef as any);
    }
  }

  handleQueryFormValuesChange = (values: Partial<QueryFormValues>): void => {
    this.props.dispatch(changeQueryFormValues(values) as AnyAction);
  };

  handleSelectQuery = (queryInfo: QueryInfo): void => {
    this.props.dispatch(selectQueryKey(queryInfo) as AnyAction);
  };

  handleTabChange = (tab: QueryPreviewTabs): void => {
    this.props.dispatch(selectedPreviewTab(tab) as AnyAction);
  };

  render(): ReactNode {
    const { selectorsSource, isWideLayout } = this.state;
    const {
      styleUtils: { styling },
    } = this.props;
    const apiStates = this.selectors.selectApiStates(selectorsSource);
    const allVisibleQueries = this.selectors.selectAllVisbileQueries(
      selectorsSource
    );

    const currentQueryInfo = this.selectors.selectorCurrentQueryInfo(
      selectorsSource
    );

    const currentRtkApi = getApiStateOf(currentQueryInfo, apiStates);
    const currentQuerySubscriptions = getQuerySubscriptionsOf(
      currentQueryInfo,
      apiStates
    );

    const currentTags = this.selectors.selectCurrentQueryTags(selectorsSource);

    console.log('inspector', {
      apiStates,
      allVisibleQueries,
      selectorsSource,
      currentQueryInfo,
      currentRtkApi,
      currentTags,
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
            values={selectorsSource.monitorState.queryForm.values}
            onFormValuesChange={this.handleQueryFormValuesChange}
          />
          <QueryList
            onSelectQuery={this.handleSelectQuery}
            queryInfos={allVisibleQueries}
            selectedQueryKey={selectorsSource.monitorState.selectedQueryKey}
          />
        </div>
        <QueryPreview
          queryInfo={currentQueryInfo}
          selectedTab={selectorsSource.monitorState.selectedPreviewTab}
          onTabChange={this.handleTabChange}
          styling={styling}
          tags={currentTags}
          querySubscriptions={currentQuerySubscriptions}
          apiConfig={currentRtkApi?.config ?? null}
          isWideLayout={isWideLayout}
        />
      </div>
    );
  }
}

export default RtkQueryInspector;
