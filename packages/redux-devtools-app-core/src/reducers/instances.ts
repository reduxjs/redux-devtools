import { PerformAction } from '@redux-devtools/core';
import { Action } from 'redux';
import {
  UPDATE_STATE,
  SET_STATE,
  LIFTED_ACTION,
  SELECT_INSTANCE,
  REMOVE_INSTANCE,
  TOGGLE_PERSIST,
  TOGGLE_SYNC,
  SET_PERSIST,
  CLEAR_INSTANCES,
} from '../constants/actionTypes';
import parseJSON from '../utils/parseJSON';
import { recompute } from '../utils/updateState';
import {
  ActionCreator,
  LiftedActionDispatchAction,
  Request,
  CoreStoreAction,
} from '../actions';

export interface Features {
  lock?: boolean;
  export?: string | boolean;
  import?: string | boolean;
  persist?: boolean;
  pause?: boolean;
  reorder?: boolean;
  jump?: boolean;
  skip?: boolean;
  dispatch?: boolean;
  sync?: boolean;
  test?: boolean;
}

export interface Options {
  name?: string | number;
  connectionId?: string | number;
  explicitLib?: string;
  lib?: string;
  actionCreators?: ActionCreator[];
  features: Features;
  serialize?: boolean;
}

export interface State {
  actionsById: { [actionId: number]: PerformAction<Action<string>> };
  computedStates: { state: unknown; error?: string }[];
  currentStateIndex: number;
  nextActionId: number;
  skippedActionIds: number[];
  stagedActionIds: number[];
  committedState?: unknown;
  isLocked?: boolean;
  isPaused?: boolean;
}

export interface InstancesState {
  selected: string | number | null;
  current: string | number;
  sync: boolean;
  connections: { [id: string]: (string | number)[] };
  options: { [id: string]: Options };
  states: { [id: string]: State };
  persisted?: boolean;
}

export const instancesInitialState: InstancesState = {
  selected: null,
  current: 'default',
  sync: false,
  connections: {},
  options: { default: { features: {} } },
  states: {
    default: {
      actionsById: {},
      computedStates: [],
      currentStateIndex: -1,
      nextActionId: 0,
      skippedActionIds: [],
      stagedActionIds: [],
    },
  },
};

function updateState(
  state: { [id: string]: State },
  request: Request,
  id: string | number,
  serialize: boolean | undefined,
) {
  let payload: State = request.payload as State;
  const actionsById = request.actionsById;
  if (actionsById) {
    payload = {
      ...payload,
      actionsById: parseJSON(actionsById, serialize),
      computedStates: parseJSON(request.computedStates, serialize),
    } as State;
    if (request.type === 'STATE' && request.committedState) {
      payload.committedState = payload.computedStates[0].state;
    }
  } else {
    payload = parseJSON(payload as unknown as string, serialize) as State;
  }

  let newState;
  const liftedState = state[id] || state.default;
  const action = ((request.action && parseJSON(request.action, serialize)) ||
    {}) as PerformAction<Action<string>>;

  switch (request.type) {
    case 'INIT':
      newState = recompute(state.default, payload, {
        action: { type: '@@INIT' },
        timestamp: (action as { timestamp?: number }).timestamp || Date.now(),
      });
      break;
    case 'ACTION': {
      const isExcess = request.isExcess;
      const nextActionId = request.nextActionId || liftedState.nextActionId + 1;
      const maxAge = request.maxAge;
      if (Array.isArray(action)) {
        // Batched actions
        newState = liftedState;
        for (let i = 0; i < action.length; i++) {
          newState = recompute(
            newState,
            request.batched ? payload : (payload as unknown as State[])[i],
            action[i] as PerformAction<Action<string>>,
            newState.nextActionId + 1,
            maxAge,
            isExcess,
          );
        }
      } else {
        newState = recompute(
          liftedState,
          payload,
          action,
          nextActionId,
          maxAge,
          isExcess,
        );
      }
      break;
    }
    case 'STATE':
      newState = payload;
      if (newState.computedStates.length <= newState.currentStateIndex) {
        newState.currentStateIndex = newState.computedStates.length - 1;
      }
      break;
    case 'PARTIAL_STATE': {
      const maxAge = request.maxAge;
      const nextActionId = payload.nextActionId;
      const stagedActionIds = payload.stagedActionIds;
      let computedStates = payload.computedStates;
      let oldActionsById;
      let oldComputedStates;
      let committedState;
      if (nextActionId > maxAge) {
        const oldStagedActionIds = liftedState.stagedActionIds;
        const excess = oldStagedActionIds.indexOf(stagedActionIds[1]);
        let key;
        if (excess > 0) {
          oldComputedStates = liftedState.computedStates.slice(excess - 1);
          oldActionsById = { ...liftedState.actionsById };
          for (let i = 1; i < excess; i++) {
            key = oldStagedActionIds[i];
            if (key) delete oldActionsById[key];
          }
          committedState = computedStates[0].state;
        } else {
          oldActionsById = liftedState.actionsById;
          oldComputedStates = liftedState.computedStates;
          committedState = liftedState.committedState;
        }
      } else {
        oldActionsById = liftedState.actionsById;
        oldComputedStates = liftedState.computedStates;
        committedState = liftedState.committedState;
      }
      computedStates = [...oldComputedStates, ...computedStates];
      const statesCount = computedStates.length;
      let currentStateIndex = payload.currentStateIndex;
      if (statesCount <= currentStateIndex) currentStateIndex = statesCount - 1;

      newState = {
        ...liftedState,
        actionsById: { ...oldActionsById, ...payload.actionsById },
        computedStates,
        currentStateIndex,
        nextActionId,
        stagedActionIds,
        committedState,
      };
      break;
    }
    case 'LIFTED':
      newState = liftedState;
      break;
    default:
      return state;
  }

  if (request.liftedState) newState = { ...newState, ...request.liftedState };
  return { ...state, [id]: newState };
}

export function dispatchAction(
  state: InstancesState,
  { action }: LiftedActionDispatchAction,
) {
  if (action.type === 'JUMP_TO_STATE' || action.type === 'JUMP_TO_ACTION') {
    const id = state.selected || state.current;
    const liftedState = state.states[id];
    const currentStateIndex =
      action.type === 'JUMP_TO_STATE'
        ? action.index
        : liftedState.stagedActionIds.indexOf(action.actionId);
    return {
      ...state,
      states: {
        ...state.states,
        [id]: { ...liftedState, currentStateIndex },
      },
    };
  }
  return state;
}

function removeState(state: InstancesState, connectionId: string | number) {
  const instanceIds = state.connections[connectionId];
  if (!instanceIds) return state;

  const connections = { ...state.connections };
  const options = { ...state.options };
  const states = { ...state.states };
  let selected = state.selected;
  let current = state.current;
  let sync = state.sync;

  delete connections[connectionId];
  instanceIds.forEach((id) => {
    if (id === selected) {
      selected = null;
      sync = false;
    }
    if (id === current) {
      const inst = Object.keys(connections)[0];
      if (inst) current = connections[inst][0];
      else current = 'default';
    }
    delete options[id];
    delete states[id];
  });
  return {
    selected,
    current,
    sync,
    connections,
    options,
    states,
  };
}

function init(
  { type, action, name, libConfig = {} }: Request,
  connectionId: string | number,
  current: string | number,
): Options {
  let lib;
  let actionCreators;
  let creators = libConfig.actionCreators || action;
  if (typeof creators === 'string') creators = JSON.parse(creators);
  if (Array.isArray(creators)) actionCreators = creators;
  if (type === 'STATE') lib = 'redux';
  return {
    name: libConfig.name || name || current,
    connectionId,
    explicitLib: libConfig.type,
    lib,
    actionCreators,
    features: libConfig.features
      ? libConfig.features
      : {
          lock: lib === 'redux',
          export: libConfig.type === 'redux' ? 'custom' : true,
          import: 'custom',
          persist: true,
          pause: true,
          reorder: true,
          jump: true,
          skip: true,
          dispatch: true,
          sync: true,
          test: true,
        },
    serialize: libConfig.serialize,
  };
}

export function instances(
  state = instancesInitialState,
  action: CoreStoreAction,
): InstancesState {
  switch (action.type) {
    case UPDATE_STATE: {
      const { request } = action;
      if (!request) return state;
      const connectionId = (action.id || request.id)!;
      const current = request.instanceId || connectionId;
      let connections = state.connections;
      let options = state.options;

      if (typeof state.options[current] === 'undefined') {
        connections = {
          ...state.connections,
          [connectionId]: [...(connections[connectionId] || []), current],
        };
        options = {
          ...options,
          [current]: init(request, connectionId, current),
        };
      }

      return {
        ...state,
        current,
        connections,
        options,
        states: updateState(
          state.states,
          request,
          current,
          options[current].serialize,
        ),
      };
    }
    case SET_STATE:
      return {
        ...state,
        states: {
          ...state.states,
          [getActiveInstance(state)]: action.newState,
        },
      };
    case TOGGLE_PERSIST:
      return { ...state, persisted: !state.persisted };
    case SET_PERSIST:
      return { ...state, persisted: action.payload };
    case TOGGLE_SYNC:
      return { ...state, sync: !state.sync };
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected, sync: false };
    case REMOVE_INSTANCE:
      return removeState(state, action.id);
    case LIFTED_ACTION: {
      if (action.message === 'DISPATCH') return dispatchAction(state, action);
      if (action.message === 'IMPORT') {
        const id = state.selected || state.current;
        if (state.options[id].features.import === true) {
          return {
            ...state,
            states: {
              ...state.states,
              [id]: parseJSON(action.state) as State,
            },
          };
        }
      }
      return state;
    }
    case CLEAR_INSTANCES:
      return instancesInitialState;
    default:
      return state;
  }
}

export const getActiveInstance = (instances: InstancesState) =>
  instances.selected || instances.current;
