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

  isLastActionNode = (keyPath: (string | number)[], layer: number): boolean => {
    if (layer >= 1) {
      const len = this.props.actionsOfQuery.length;
      const actionKey = keyPath[keyPath.length - 1];

      if (typeof actionKey === 'string') {
        const index = Number(actionKey.split(keySep)[0]);

        return len > 0 && len - index < 2;
      }
    }

    return false;
  };

  shouldExpandNode = (
    keyPath: (string | number)[],
    value: unknown,
    layer: number
  ): boolean => {
    if (layer === 1) {
      return this.isLastActionNode(keyPath, layer);
    }

    if (layer === 2) {
      return (
        this.isLastActionNode(keyPath, layer) &&
        (keyPath[0] === 'meta' || keyPath[0] === 'error')
      );
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
