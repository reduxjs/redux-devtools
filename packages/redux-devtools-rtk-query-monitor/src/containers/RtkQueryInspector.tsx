import React, { PureComponent, createRef, ReactNode } from 'react';
import type { Dispatch, Action } from '@reduxjs/toolkit';
import type { LiftedAction, LiftedState } from '@redux-devtools/core';
import {
  QueryFormValues,
  QueryPreviewTabs,
  RtkQueryMonitorState,
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

type ForwardedMonitorProps<S, A extends Action<string>> = Pick<
  LiftedState<S, A, RtkQueryMonitorState>,
  'monitorState' | 'currentStateIndex' | 'computedStates' | 'actionsById'
>;

export interface RtkQueryInspectorProps<S, A extends Action<string>>
  extends ForwardedMonitorProps<S, A> {
  dispatch: Dispatch<LiftedAction<S, A, RtkQueryMonitorState>>;
}

type RtkQueryInspectorState<S> = {
  selectorsSource: SelectorsSource<S>;
  isWideLayout: boolean;
};

class RtkQueryInspector<S, A extends Action<string>> extends PureComponent<
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
    props: RtkQueryInspectorProps<unknown, Action<string>>,
    state: RtkQueryInspectorState<unknown>,
  ): null | Partial<RtkQueryInspectorState<unknown>> {
    const selectorsSource = computeSelectorSource<unknown, Action<string>>(
      props,
      state.selectorsSource,
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
    this.props.dispatch(
      changeQueryFormValues(values) as unknown as LiftedAction<
        S,
        A,
        RtkQueryMonitorState
      >,
    );
  };

  handleSelectQuery = (queryInfo: RtkResourceInfo): void => {
    this.props.dispatch(
      selectQueryKey(queryInfo) as unknown as LiftedAction<
        S,
        A,
        RtkQueryMonitorState
      >,
    );
  };

  handleTabChange = (tab: QueryPreviewTabs): void => {
    this.props.dispatch(
      selectedPreviewTab(tab) as unknown as LiftedAction<
        S,
        A,
        RtkQueryMonitorState
      >,
    );
  };

  render(): ReactNode {
    const { selectorsSource, isWideLayout } = this.state;
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
        css={(theme) => ({
          display: 'flex',
          flexFlow: 'column nowrap',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
          fontSize: '12px',
          WebkitFontSmoothing: 'antialiased',
          lineHeight: '1.5em',

          backgroundColor: theme.BACKGROUND_COLOR,
          color: theme.TEXT_COLOR,

          '&[data-wide-layout="1"]': {
            flexFlow: 'row nowrap',
          },
        })}
      >
        <div
          css={(theme) => ({
            display: 'flex',
            flex: '0 0 auto',
            height: '50%',
            width: '100%',
            borderColor: theme.TAB_BORDER_COLOR,

            '&[data-wide-layout="0"]': {
              borderBottomWidth: 1,
              borderStyle: 'solid',
            },

            '&[data-wide-layout="1"]': {
              height: '100%',
              width: '44%',
              borderRightWidth: 1,
              borderStyle: 'solid',
            },
            flexFlow: 'column nowrap',
            '& > form': {
              flex: '0 0 auto',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderColor: theme.LIST_BORDER_COLOR,
            },
            '& > ul': {
              flex: '1 1 auto',
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: 'calc(100% - 70px)',
            },
          })}
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
          isWideLayout={isWideLayout}
          hasNoApis={hasNoApi}
        />
      </div>
    );
  }
}

export default RtkQueryInspector;
