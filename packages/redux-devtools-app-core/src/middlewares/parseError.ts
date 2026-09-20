import { Dispatch, Middleware } from 'redux';
import {
  UPDATE_STATE,
  LIFTED_ACTION,
  ERROR,
} from '../constants/actionTypes.js';
import { ParseJSONError } from '../utils/parseJSON.js';
import { CoreStoreAction } from '../actions/index.js';
import { CoreStoreState } from '../reducers/index.js';

function mayParse(action: CoreStoreAction) {
  return (
    action.type === UPDATE_STATE ||
    (action.type === LIFTED_ACTION && action.message === 'IMPORT')
  );
}

export const parseErrorMiddleware: Middleware<
  {},
  CoreStoreState,
  Dispatch<CoreStoreAction>
> = (store) => (next) => (untypedAction) => {
  const action = untypedAction as CoreStoreAction;
  if (!mayParse(action)) return next(action);
  try {
    return next(action);
  } catch (e) {
    if (!(e instanceof ParseJSONError)) throw e;
    if (process.env.NODE_ENV !== 'production') console.error(e);
    store.dispatch({ type: ERROR, payload: e.message });
    return action;
  }
};
