import React, { ReactNode, PureComponent } from 'react';
import { QueryPreviewTabProps } from '../types';
import { TreeView } from './TreeView';

export interface QueryPreviewSubscriptionsState {
  data: { subscriptions: QueryPreviewTabProps['querySubscriptions'] };
}

export class QueryPreviewSubscriptions extends PureComponent<
  QueryPreviewTabProps,
  QueryPreviewSubscriptionsState
> {
  static getDerivedStateFromProps(
    props: QueryPreviewTabProps,
    state: QueryPreviewSubscriptionsState
  ): Partial<QueryPreviewSubscriptionsState> | null {
    if (props.querySubscriptions !== state.data.subscriptions) {
      return {
        data: { subscriptions: props.querySubscriptions },
      };
    }

    return null;
  }

  constructor(props: QueryPreviewTabProps) {
    super(props);

    this.state = {
      data: { subscriptions: props.querySubscriptions },
    };
  }

  render(): ReactNode {
    const {
      queryInfo,
      isWideLayout,
      base16Theme,
      styling,
      invertTheme,
      querySubscriptions,
    } = this.props;

    if (!querySubscriptions || !queryInfo) {
      return null;
    }

    return (
      <>
        <TreeView
          data={this.state.data}
          isWideLayout={isWideLayout}
          base16Theme={base16Theme}
          styling={styling}
          invertTheme={invertTheme}
        />
      </>
    );
  }
}
