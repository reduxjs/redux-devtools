import { Button, Toolbar } from '@redux-devtools/ui';
import React from 'react';
import { AnyAction, Dispatch } from 'redux';

interface RTKActionButtonsProps {
  dispatch?: Dispatch<AnyAction>;
  liftedDispatch?: Dispatch<AnyAction>;
  data: Record<string, AnyAction>;
}

const ACTION_TYPES = {
  REFRESH: 'REFRESH',
  FULFILLED: 'FULFILLED',
  TRIGGER_FETCHING: 'TRIGGER_FETCHING',
} as const;

const REFRESH_TIMEOUT_MS = 1000;

export const RTKActionButtons: React.FC<RTKActionButtonsProps> = ({
  dispatch,
  liftedDispatch,
  data,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const pending = Object.values(data).filter(
    (action) => action.meta?.requestStatus === 'pending',
  );

  const fulfilled = Object.values(data).filter(
    (action) => action.meta?.requestStatus === 'fulfilled',
  );

  // Get the most recent actions
  const recentPending = pending[pending.length - 1];
  const recentFulfilled = fulfilled[fulfilled.length - 1];

  const handleAction = (
    actionType: keyof typeof ACTION_TYPES,
    action: AnyAction,
    fulfilledAction?: AnyAction,
  ) => {
    setIsLoading(true);
    if (liftedDispatch) {
      try {
        const performAction = {
          type: 'PERFORM_ACTION' as const,
          action,
          timestamp: Date.now(),
        };
        liftedDispatch(performAction);

        // For refresh actions, automatically dispatch fulfilled action after delay
        if (actionType === ACTION_TYPES.REFRESH && fulfilledAction) {
          setTimeout(() => {
            const resolveAction = {
              type: 'PERFORM_ACTION' as const,
              action: fulfilledAction,
              timestamp: Date.now(),
            };
            liftedDispatch(resolveAction);
            setIsLoading(false);
          }, REFRESH_TIMEOUT_MS);
        }
      } catch (error) {
        console.error('Error in liftedDispatch:', error);
      }
    }

    if (dispatch) {
      try {
        dispatch(action);

        // For refresh actions, automatically dispatch fulfilled action after delay
        if (actionType === ACTION_TYPES.REFRESH && fulfilledAction) {
          setTimeout(() => {
            dispatch(fulfilledAction);
            setIsLoading(false);
          }, REFRESH_TIMEOUT_MS);
        }
      } catch (error) {
        console.error('Error in dispatch:', error);
      }
    }
  };

  return (
    <Toolbar
      borderPosition="bottom"
      style={{ alignItems: 'center' }}
      key={JSON.stringify(data)}
    >
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
        mark={isLoading && 'base0D'}
        onClick={() =>
          handleAction(ACTION_TYPES.REFRESH, recentPending, recentFulfilled)
        }
        disabled={isLoading || !recentPending || !recentFulfilled}
      >
        Refresh
      </Button>

      <Button
        mark={isLoading && 'base0D'}
        onClick={() =>
          handleAction(ACTION_TYPES.TRIGGER_FETCHING, recentPending)
        }
        disabled={isLoading || !recentPending || !recentFulfilled}
      >
        Fetching
      </Button>

      <Button
        onClick={() => {
          handleAction(ACTION_TYPES.FULFILLED, recentFulfilled);
          setIsLoading(false);
        }}
        disabled={!recentFulfilled}
      >
        Fulfill
      </Button>
    </Toolbar>
  );
};
