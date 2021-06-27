import { createSelector } from '@reduxjs/toolkit';
import React, { ReactNode, PureComponent } from 'react';
import { Action, AnyAction } from 'redux';
import { emptyRecord, identity } from '../utils/object';
import { TreeView } from './TreeView';

export interface QueryPreviewActionsProps {
  isWideLayout: boolean;
  actionsOfQuery: AnyAction[];
}

const keySep = ' - ';

export class QueryPreviewActions extends PureComponent<QueryPreviewActionsProps> {
  selectFormattedActions = createSelector<
    AnyAction[],
    AnyAction[],
    Record<string, AnyAction>
  >(identity, (actions) => {
    const output: Record<string, AnyAction> = {};

    if (actions.length === 0) {
      return emptyRecord;
    }

    for (let i = 0, len = actions.length; i < len; i++) {
      const action = actions[i];
      const key = `${i}${keySep}${(action as Action<string>)?.type ?? ''}`;
      output[key] = action;
    }

    return output;
  });

  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    if (layer === 1) {
      const len = this.props.actionsOfQuery.length;
      const lastKey = keyPath[keyPath.length - 1];

      if (typeof lastKey === 'string') {
        const index = Number(lastKey.split(keySep)[0]);

        return len - index < 2;
      }

      return false;
    }

    return layer <= 1;
  };

  render(): ReactNode {
    const { isWideLayout, actionsOfQuery } = this.props;

    return (
      <TreeView
        data={this.selectFormattedActions(actionsOfQuery)}
        isWideLayout={isWideLayout}
        shouldExpandNode={this.shouldExpandNode}
      />
    );
  }
}
