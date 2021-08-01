import React, { PureComponent, createRef, ReactNode } from 'react';
import type { AnyAction, Dispatch, Action } from '@reduxjs/toolkit';
import type { LiftedAction, LiftedState } from '@redux-devtools/core';
import {
  QueryFormValues,
  QueryPreviewTabs,
  RtkQueryMonitorState,
  StyleUtils,
  SelectorsSource,
  RtkResourceInfo,
} from '../types';
import { createInspectorSelectors, computeSelectorSource } from '../selectors';
import {
  changeQueryFormValues,
  selectedPreviewTab,
  selectQueryKey,
} from '../reducers';
import { QueryList } from '../components/QueryList';
import { QueryForm } from '../components/QueryForm';
import { QueryPreview } from './QueryPreview';

type ForwardedMonitorProps<S, A extends Action<unknown>> = Pick<
  LiftedState<S, A, RtkQueryMonitorState>,
  'monitorState' | 'currentStateIndex' | 'computedStates' | 'actionsById'
>;

export interface RtkQueryInspectorProps<S, A extends Action<unknown>>
  extends ForwardedMonitorProps<S, A> {
  dispatch: Dispatch<LiftedAction<S, A, RtkQueryMonitorState>>;
  styleUtils: StyleUtils;
}

type RtkQueryInspectorState<S> = {
  selectorsSource: SelectorsSource<S>;
  isWideLayout: boolean;
};

class RtkQueryInspector<S, A extends Action<unknown>> extends PureComponent<
  RtkQueryInspectorProps<S, A>,
  RtkQueryInspectorState<S>
> {
  inspectorRef = createRef<HTMLDivElement>();

  isWideIntervalRef: ReturnType<typeof setInterval> | null = null;

  constructor(props: RtkQueryInspectorProps<S, A>) {
    super(props);

    this.state = {
      isWideLayout: true,
      selectorsSource: computeSelectorSource(props, null),
    };
  }

  static wideLayout = 600;

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
        this.inspectorRef.current.offsetWidth >= RtkQueryInspector.wideLayout;

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
      clearTimeout(this.isWideIntervalRef);
    }
  }

  handleQueryFormValuesChange = (values: Partial<QueryFormValues>): void => {
    this.props.dispatch(changeQueryFormValues(values) as AnyAction);
  };

  handleSelectQuery = (queryInfo: RtkResourceInfo): void => {
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
    const allVisibleRtkResourceInfos =
      this.selectors.selectAllVisbileQueries(selectorsSource);

    const currentResInfo =
      this.selectors.selectCurrentQueryInfo(selectorsSource);

    const apiStates = this.selectors.selectApiStates(selectorsSource);

    const hasNoApi = apiStates == null;

    const searchQueryRegex =
      this.selectors.selectSearchQueryRegex(selectorsSource);

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
            searchQueryRegex={searchQueryRegex}
            values={selectorsSource.monitorState.queryForm.values}
            onFormValuesChange={this.handleQueryFormValuesChange}
          />
          <QueryList
            onSelectQuery={this.handleSelectQuery}
            resInfos={allVisibleRtkResourceInfos}
            selectedQueryKey={selectorsSource.monitorState.selectedQueryKey}
          />
        </div>
        <QueryPreview<S>
          selectorsSource={this.state.selectorsSource}
          selectors={this.selectors}
          resInfo={currentResInfo}
          selectedTab={selectorsSource.monitorState.selectedPreviewTab}
          onTabChange={this.handleTabChange}
          styling={styling}
          isWideLayout={isWideLayout}
          hasNoApis={hasNoApi}
        />
      </div>
    );
  }
}

export default RtkQueryInspector;
