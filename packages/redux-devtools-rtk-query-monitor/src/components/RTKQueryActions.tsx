import { AnyAction, Dispatch } from 'redux';
import React from 'react';
import { Button, Toolbar } from '@redux-devtools/ui';
import { RtkResourceInfo } from '../types';

interface RTKActionButtonsProps {
  dispatch?: Dispatch<AnyAction>;
  liftedDispatch?: Dispatch<AnyAction>;
  resInfo?: RtkResourceInfo | null;
  actionsOfQuery?: AnyAction[];
}

const ACTION_TYPES = {
  REFRESH: 'REFRESH',
  FULFILLED: 'FULFILLED',
  TRIGGER_LOADING: 'TRIGGER_LOADING',
} as const;

const createFulfilledMeta = (
  requestStatus: string,
  requestId: string,
  baseEndpoint: string,
  parsedArgs: any,
  queryKey: string,
) => ({
  arg: {
    type: 'query',
    subscribe: true,
    forceRefetch: true,
    subscriptionOptions: {
      pollingInterval: 0,
      skipPollingIfUnfocused: false,
    },
    endpointName: baseEndpoint,
    originalArgs: parsedArgs || {},
    queryCacheKey: queryKey,
  },
  requestId,
  requestStatus,
  fulfilledTimeStamp: Date.now(),
  baseQueryMeta: {
    request: {},
    response: {},
  },
  RTK_autoBatch: true,
});

const createPendingMeta = (
  requestStatus: string,
  requestId: string,
  baseEndpoint: string,
  parsedArgs: any,
  queryKey: string,
) => ({
  arg: {
    type: 'query',
    subscribe: true,
    forceRefetch: true,
    subscriptionOptions: {
      pollingInterval: 0,
      skipPollingIfUnfocused: false,
    },
    endpointName: baseEndpoint,
    originalArgs: parsedArgs || {},
    queryCacheKey: queryKey,
  },
  requestId,
  requestStatus,
  baseQueryMeta: {
    request: {},
    response: {},
  },
  RTK_autoBatch: true,
});

export const createRtkQueryActions = (
  reducerPath: string,
  queryKey: string,
  endpointName?: string,
  currentData?: any,
  originalArgs?: any,
) => {
  const baseEndpoint = endpointName || queryKey.split('(')[0];
  let parsedArgs = originalArgs;
  if (!parsedArgs && queryKey.includes('(')) {
    const argsString = queryKey.split('(')[1]?.split(')')[0];
    if (
      argsString === undefined ||
      argsString === '' ||
      argsString === 'undefined'
    ) {
      parsedArgs = undefined;
    } else {
      try {
        parsedArgs = JSON.parse(argsString);
      } catch (e) {
        parsedArgs = undefined;
      }
    }
  }
  const actualPayload = currentData || {
    message: `No data available for ${baseEndpoint}`,
    timestamp: Date.now(),
    endpointName: baseEndpoint,
    queryKey: queryKey,
  };

  return {
    refresh: {
      type: `${reducerPath}/executeQuery/pending`,
      payload: undefined,
      meta: createPendingMeta(
        'pending',
        `refresh-${Date.now()}`,
        baseEndpoint,
        parsedArgs,
        queryKey,
      ),
    },
    fulfilled: {
      type: `${reducerPath}/executeQuery/fulfilled`,
      payload: actualPayload,
      meta: createFulfilledMeta(
        'fulfilled',
        `fulfilled-${Date.now()}`,
        baseEndpoint,
        parsedArgs,
        queryKey,
      ),
    },
    triggerLoading: {
      type: `${reducerPath}/executeQuery/pending`,
      payload: undefined,
      meta: createPendingMeta(
        'pending',
        `loading-${Date.now()}`,
        baseEndpoint,
        parsedArgs,
        queryKey,
      ),
    },
  };
};

export const RTKActionButtons: React.FC<RTKActionButtonsProps> = ({
  dispatch,
  liftedDispatch,
  resInfo,
  actionsOfQuery,
}) => {
  // Extract current data from query actions if available
  let currentData: any;
  if (actionsOfQuery && actionsOfQuery.length > 0) {
    // Look for the most recent fulfilled action to get current data
    const fulfilledActions = actionsOfQuery.filter(
      (action) => action.type?.includes('/fulfilled') && action.payload,
    );
    if (fulfilledActions.length > 0) {
      currentData = fulfilledActions[fulfilledActions.length - 1].payload;
      console.log('📊 Found current data from actions:', currentData);
    }
  }

  if (!resInfo) {
    return (
      <div css={{ padding: '8px 12px', fontSize: '12px', color: 'orange' }}>
        No query selected
      </div>
    );
  }
  let originalArgs;
  let lastPendingAction;

  if (actionsOfQuery && actionsOfQuery.length > 0) {
    const queryAction = actionsOfQuery.find(
      (action) =>
        action.type?.includes('/executeQuery/') ||
        action.type?.includes('/pending') ||
        action.type?.includes('/fulfilled'),
    );
    if (queryAction?.meta?.arg?.originalArgs) {
      originalArgs = queryAction.meta.arg.originalArgs;
    }
    const pendingActions = actionsOfQuery.filter(
      (action) => action.type?.includes('/pending') && action.meta?.requestId,
    );
    if (pendingActions.length > 0) {
      lastPendingAction = pendingActions[pendingActions.length - 1];
    }
  }

  const actions = createRtkQueryActions(
    resInfo.reducerPath,
    resInfo.queryKey,
    resInfo.queryKey.split('(')[0],
    currentData,
    originalArgs,
  );

  if (lastPendingAction) {
    actions.fulfilled.meta.requestId = lastPendingAction.meta.requestId;

    actions.fulfilled.meta.arg.queryCacheKey =
      lastPendingAction.meta.arg.queryCacheKey;

    actions.triggerLoading.meta.requestId = lastPendingAction.meta.requestId;

    actions.triggerLoading.meta.arg.queryCacheKey =
      lastPendingAction.meta.arg.queryCacheKey;

    actions.refresh.meta.requestId = lastPendingAction.meta.requestId;

    actions.refresh.meta.arg.queryCacheKey =
      lastPendingAction.meta.arg.queryCacheKey;
  }

  const handleAction = (
    actionType: keyof typeof ACTION_TYPES,
    action: AnyAction,
  ) => {
    if (liftedDispatch) {
      try {
        const performAction = {
          type: 'PERFORM_ACTION' as const,
          action,
          timestamp: Date.now(),
        };
        liftedDispatch(performAction);

        if (actionType === ACTION_TYPES.REFRESH && currentData) {
          setTimeout(() => {
            const resolveAction = {
              type: 'PERFORM_ACTION' as const,
              action: actions.fulfilled,
              timestamp: Date.now(),
            };
            liftedDispatch(resolveAction);
          }, 1000);
        }
      } catch (e) {
        console.error('Error in liftedDispatch:', e);
      }
    }

    if (dispatch) {
      try {
        dispatch(action);
        if (actionType === ACTION_TYPES.REFRESH && currentData) {
          setTimeout(() => {
            dispatch(actions.fulfilled);
          }, 1000);
        }
      } catch (e) {
        console.error('Error in dispatch:', e);
      }
    }
  };

  return (
    <Toolbar borderPosition="bottom" style={{ alignItems: 'center' }}>
      <label
        css={(theme) => ({
          fontSize: '12px',
          fontWeight: 'bold',
          color: theme.TEXT_COLOR,
          marginRight: '8px',
        })}
      >
        RTK Query Actions:
      </label>
      <Button
        tooltipPosition="top-right"
        onClick={() => handleAction(ACTION_TYPES.REFRESH, actions.refresh)}
        title="Force refetch"
      >
        Refresh
      </Button>
      <Button
        tooltipPosition="top-right"
        onClick={() =>
          handleAction(ACTION_TYPES.TRIGGER_LOADING, actions.triggerLoading)
        }
        title="Simulate loading state"
      >
        Loading
      </Button>
      <Button
        tooltipPosition="top-right"
        onClick={() => handleAction(ACTION_TYPES.FULFILLED, actions.fulfilled)}
        title="Simulate successful response"
      >
        Fulfill
      </Button>
    </Toolbar>
  );
};
