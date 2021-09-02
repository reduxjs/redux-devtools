import {
  getActionsArray,
  evalAction,
  ActionCreatorObject,
} from '@redux-devtools/utils';
import throttle from 'lodash/throttle';
import {
  Action,
  ActionCreator,
  Dispatch,
  PreloadedState,
  Reducer,
  Store,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from 'redux';
import Immutable from 'immutable';
import { EnhancedStore, PerformAction } from '@redux-devtools/instrument';
import createStore from '../../../app/stores/createStore';
import configureStore, { getUrlParam } from '../../../app/stores/enhancerStore';
import { isAllowed, Options } from '../options/syncOptions';
import Monitor from '../../../app/service/Monitor';
import {
  noFiltersApplied,
  getLocalFilter,
  isFiltered,
  filterState,
  startingFrom,
} from '../../../app/api/filters';
import notifyErrors from '../../../app/api/notifyErrors';
import importState from '../../../app/api/importState';
import openWindow, { Position } from '../../../app/api/openWindow';
import generateId from '../../../app/api/generateInstanceId';
import {
  updateStore,
  toContentScript,
  sendMessage,
  setListener,
  connect,
  disconnect,
  isInIframe,
  getSerializeParameter,
  Serialize,
  StructuralPerformAction,
  ConnectResponse,
} from '../../../app/api';
import { LiftedAction, LiftedState } from '@redux-devtools/instrument';
import {
  CustomAction,
  DispatchAction,
  LibConfig,
} from '@redux-devtools/app/lib/actions';
import { ContentScriptToPageScriptMessage } from './contentScript';
import { Features } from '@redux-devtools/app/lib/reducers/instances';

type EnhancedStoreWithInitialDispatch<
  S,
  A extends Action<unknown>,
  MonitorState
> = EnhancedStore<S, A, MonitorState> & { initialDispatch: Dispatch<A> };

const source = '@devtools-page';
let stores: {
  [K in string | number]: EnhancedStoreWithInitialDispatch<
    unknown,
    Action<unknown>,
    unknown
  >;
} = {};
let reportId: string | null | undefined;

function deprecateParam(oldParam: string, newParam: string) {
  /* eslint-disable no-console */
  console.warn(
    `${oldParam} parameter is deprecated, use ${newParam} instead: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md`
  );
  /* eslint-enable no-console */
}

export interface SerializeWithImmutable extends Serialize {
  readonly immutable?: typeof Immutable;
  readonly refs?: (new (data: any) => unknown)[] | null;
}

export interface ConfigWithExpandedMaxAge {
  instanceId?: number;
  readonly actionsBlacklist?: string | readonly string[];
  readonly actionsWhitelist?: string | readonly string[];
  serialize?: boolean | SerializeWithImmutable;
  readonly serializeState?:
    | boolean
    | ((key: string, value: unknown) => unknown)
    | Serialize;
  readonly serializeAction?:
    | boolean
    | ((key: string, value: unknown) => unknown)
    | Serialize;
  readonly statesFilter?: <S>(state: S, index?: number) => S;
  readonly actionsFilter?: <A extends Action<unknown>>(
    action: A,
    id?: number
  ) => A;
  readonly stateSanitizer?: <S>(state: S, index?: number) => S;
  readonly actionSanitizer?: <A extends Action<unknown>>(
    action: A,
    id?: number
  ) => A;
  readonly predicate?: <S, A extends Action<unknown>>(
    state: S,
    action: A
  ) => boolean;
  readonly latency?: number;
  readonly getMonitor?: <S, A extends Action<unknown>>(
    monitor: Monitor<S, A>
  ) => void;
  readonly maxAge?:
    | number
    | (<S, A extends Action<unknown>>(
        currentLiftedAction: LiftedAction<S, A, unknown>,
        previousLiftedState: LiftedState<S, A, unknown> | undefined
      ) => number);
  readonly trace?: boolean | (() => string | undefined);
  readonly traceLimit?: number;
  readonly shouldCatchErrors?: boolean;
  readonly shouldHotReload?: boolean;
  readonly shouldRecordChanges?: boolean;
  readonly shouldStartLocked?: boolean;
  readonly pauseActionType?: unknown;
  readonly deserializeState?: <S>(state: S) => S;
  readonly deserializeAction?: <A extends Action<unknown>>(action: A) => A;
  name?: string;
  readonly autoPause?: boolean;
  readonly features?: Features;
  readonly type?: string;
  readonly getActionType?: <A extends Action<unknown>>(action: A) => A;
  readonly actionCreators?: {
    readonly [key: string]: ActionCreator<Action<unknown>>;
  };
}

export interface Config extends ConfigWithExpandedMaxAge {
  readonly maxAge?: number;
}

interface ReduxDevtoolsExtension {
  <S, A extends Action<unknown>>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>,
    config?: Config
  ): Store<S, A>;
  (config?: Config): StoreEnhancer;
  open: (position?: Position) => void;
  updateStore: (
    newStore: EnhancedStore<unknown, Action<unknown>, unknown>,
    instanceId: number
  ) => void;
  notifyErrors: (onError?: () => boolean) => void;
  send: <S, A extends Action<unknown>>(
    action: StructuralPerformAction<A> | StructuralPerformAction<A>[],
    state: LiftedState<S, A, unknown>,
    config: Config,
    instanceId?: number,
    name?: string
  ) => void;
  listen: (
    onMessage: (message: ContentScriptToPageScriptMessage) => void,
    instanceId: number
  ) => void;
  connect: (preConfig: Config) => ConnectResponse;
  disconnect: () => void;
}

declare global {
  interface Window {
    devToolsOptions: Options;
  }
}

function __REDUX_DEVTOOLS_EXTENSION__<S, A extends Action<unknown>>(
  reducer?: Reducer<S, A>,
  preloadedState?: PreloadedState<S>,
  config?: Config
): Store<S, A>;
function __REDUX_DEVTOOLS_EXTENSION__(config: Config): StoreEnhancer;
function __REDUX_DEVTOOLS_EXTENSION__<S, A extends Action<unknown>>(
  reducer?: Reducer<S, A> | Config | undefined,
  preloadedState?: PreloadedState<S>,
  config?: Config
): Store<S, A> | StoreEnhancer {
  /* eslint-disable no-param-reassign */
  if (typeof reducer === 'object') {
    config = reducer;
    reducer = undefined;
  } else if (typeof config !== 'object') config = {};
  /* eslint-enable no-param-reassign */
  if (!window.devToolsOptions) window.devToolsOptions = {} as any;

  let store: EnhancedStoreWithInitialDispatch<S, A, unknown>;
  let errorOccurred = false;
  let maxAge: number | undefined;
  let actionCreators: readonly ActionCreatorObject[];
  let sendingActionId = 1;
  const instanceId = generateId(config.instanceId);
  const localFilter = getLocalFilter(config);
  const serializeState = getSerializeParameter(config, 'serializeState');
  const serializeAction = getSerializeParameter(config, 'serializeAction');
  let {
    statesFilter,
    actionsFilter,
    stateSanitizer,
    actionSanitizer,
    predicate,
    latency = 500,
  } = config;

  // Deprecate statesFilter and actionsFilter
  if (statesFilter) {
    deprecateParam('statesFilter', 'stateSanitizer');
    stateSanitizer = statesFilter; // eslint-disable-line no-param-reassign
  }
  if (actionsFilter) {
    deprecateParam('actionsFilter', 'actionSanitizer');
    actionSanitizer = actionsFilter; // eslint-disable-line no-param-reassign
  }

  const relayState = throttle(
    (
      liftedState?: LiftedState<S, A, unknown> | undefined,
      libConfig?: LibConfig
    ) => {
      relayAction.cancel();
      const state = liftedState || store.liftedStore.getState();
      sendingActionId = state.nextActionId;
      toContentScript(
        {
          type: 'STATE',
          payload: filterState(
            state,
            localFilter,
            stateSanitizer,
            actionSanitizer,
            predicate
          ),
          source,
          instanceId,
          libConfig,
        },
        serializeState,
        serializeAction
      );
    },
    latency
  );

  const monitor = new Monitor(relayState);
  if (config.getMonitor) {
    /* eslint-disable no-console */
    console.warn(
      "Redux DevTools extension's `getMonitor` parameter is deprecated and will be not " +
        'supported in the next version, please remove it and just use ' +
        '`__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` instead: ' +
        'https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup'
    );
    /* eslint-enable no-console */
    config.getMonitor(monitor);
  }

  function exportState() {
    const liftedState = store.liftedStore.getState();
    const actionsById = liftedState.actionsById;
    const payload: A[] = [];
    liftedState.stagedActionIds.slice(1).forEach((id) => {
      // if (isFiltered(actionsById[id].action, localFilter)) return;
      payload.push(actionsById[id].action);
    });
    toContentScript(
      {
        type: 'EXPORT',
        payload,
        committedState: liftedState.committedState,
        source,
        instanceId,
      },
      serializeState,
      serializeAction
    );
  }

  const relayAction = throttle(() => {
    const liftedState = store.liftedStore.getState();
    const nextActionId = liftedState.nextActionId;
    const currentActionId = nextActionId - 1;
    const liftedAction = liftedState.actionsById[currentActionId];

    // Send a single action
    if (sendingActionId === currentActionId) {
      sendingActionId = nextActionId;
      const action = liftedAction.action;
      const computedStates = liftedState.computedStates;
      if (
        isFiltered(action, localFilter) ||
        (predicate &&
          !predicate(computedStates[computedStates.length - 1].state, action))
      ) {
        return;
      }
      const state =
        liftedState.computedStates[liftedState.computedStates.length - 1].state;
      toContentScript(
        {
          type: 'ACTION',
          payload: !stateSanitizer
            ? state
            : stateSanitizer(state, nextActionId - 1),
          source,
          instanceId,
          action: !actionSanitizer
            ? liftedState.actionsById[nextActionId - 1]
            : actionSanitizer(
                liftedState.actionsById[nextActionId - 1].action,
                nextActionId - 1
              ),
          maxAge: getMaxAge(),
          nextActionId,
        },
        serializeState,
        serializeAction
      );
      return;
    }

    // Send multiple actions
    const payload = startingFrom(
      sendingActionId,
      liftedState,
      localFilter,
      stateSanitizer,
      actionSanitizer,
      predicate
    );
    sendingActionId = nextActionId;
    if (typeof payload === 'undefined') return;
    if ('skippedActionIds' in payload) {
      toContentScript(
        {
          type: 'STATE',
          payload: filterState(
            payload,
            localFilter,
            stateSanitizer,
            actionSanitizer,
            predicate
          ),
          source,
          instanceId,
        },
        serializeState,
        serializeAction
      );
      return;
    }
    toContentScript(
      {
        type: 'PARTIAL_STATE',
        payload,
        source,
        instanceId,
        maxAge: getMaxAge(),
      },
      serializeState,
      serializeAction
    );
  }, latency);

  function dispatchRemotely(action: string | CustomAction) {
    if (config!.features && !config!.features.dispatch) return;
    try {
      const result = evalAction(action, actionCreators);
      (store.initialDispatch || store.dispatch)(result);
    } catch (e) {
      toContentScript(
        {
          type: 'ERROR',
          payload: e.message,
          source,
          instanceId,
        },
        serializeState,
        serializeAction
      );
    }
  }

  function importPayloadFrom(state: string | undefined) {
    if (config!.features && !config!.features.import) return;
    try {
      const nextLiftedState = importState<S, A>(state, config!);
      if (!nextLiftedState) return;
      store.liftedStore.dispatch({ type: 'IMPORT_STATE', ...nextLiftedState });
    } catch (e) {
      toContentScript(
        {
          type: 'ERROR',
          payload: e.message,
          source,
          instanceId,
        },
        serializeState,
        serializeAction
      );
    }
  }

  function dispatchMonitorAction(action: DispatchAction) {
    const features = config!.features;
    if (features) {
      if (
        !features.jump &&
        (action.type === 'JUMP_TO_STATE' || action.type === 'JUMP_TO_ACTION')
      ) {
        return;
      }
      if (!features.skip && action.type === 'TOGGLE_ACTION') return;
      if (!features.reorder && action.type === 'REORDER_ACTION') return;
      if (!features.import && action.type === 'IMPORT_STATE') return;
      if (!features.lock && action.type === 'LOCK_CHANGES') return;
      if (!features.pause && action.type === 'PAUSE_RECORDING') return;
    }
    store.liftedStore.dispatch(action as any);
  }

  function onMessage(message: ContentScriptToPageScriptMessage) {
    switch (message.type) {
      case 'DISPATCH':
        dispatchMonitorAction(message.payload);
        return;
      case 'ACTION':
        dispatchRemotely(message.payload);
        return;
      case 'IMPORT':
        importPayloadFrom(message.state);
        return;
      case 'EXPORT':
        exportState();
        return;
      case 'UPDATE':
        relayState();
        return;
      case 'START':
        monitor.start(true);
        if (!actionCreators && config!.actionCreators) {
          actionCreators = getActionsArray(config!.actionCreators);
        }
        relayState(undefined, {
          name: config!.name || document.title,
          actionCreators: JSON.stringify(actionCreators),
          features: config!.features,
          serialize: !!config!.serialize,
          type: 'redux',
        });

        if (reportId) {
          toContentScript(
            {
              type: 'GET_REPORT',
              payload: reportId,
              source,
              instanceId,
            },
            serializeState,
            serializeAction
          );
          reportId = null;
        }
        return;
      case 'STOP':
        monitor.stop();
        relayAction.cancel();
        relayState.cancel();
        if (!message.failed) {
          toContentScript(
            {
              type: 'STOP',
              payload: undefined,
              source,
              instanceId,
            },
            serializeState,
            serializeAction
          );
        }
    }
  }

  const filteredActionIds: number[] = []; // simple circular buffer of non-excluded actions with fixed maxAge-1 length
  const getMaxAge = (
    liftedAction?: LiftedAction<S, A, unknown>,
    liftedState?: LiftedState<S, A, unknown> | undefined
  ) => {
    let m = (config && config.maxAge) || window.devToolsOptions.maxAge || 50;
    if (
      !liftedAction ||
      noFiltersApplied(localFilter) ||
      !(liftedAction as PerformAction<A>).action
    ) {
      return m;
    }
    if (!maxAge || maxAge < m) maxAge = m; // it can be modified in process on options page
    if (isFiltered((liftedAction as PerformAction<A>).action, localFilter)) {
      // TODO: check also predicate && !predicate(state, action) with current state
      maxAge++;
    } else {
      filteredActionIds.push(liftedState!.nextActionId);
      if (filteredActionIds.length >= m) {
        const stagedActionIds = liftedState!.stagedActionIds;
        let i = 1;
        while (
          maxAge > m &&
          filteredActionIds.indexOf(stagedActionIds[i]) === -1
        ) {
          maxAge--;
          i++;
        }
        filteredActionIds.shift();
      }
    }
    return maxAge;
  };

  function init() {
    setListener(onMessage, instanceId);
    notifyErrors(() => {
      errorOccurred = true;
      const state = store.liftedStore.getState();
      if (state.computedStates[state.currentStateIndex].error) {
        relayState(state);
      }
      return true;
    });

    toContentScript(
      {
        type: 'INIT_INSTANCE',
        payload: undefined,
        source,
        instanceId,
      },
      serializeState,
      serializeAction
    );
    store.subscribe(handleChange);

    if (typeof reportId === 'undefined') {
      reportId = getUrlParam('remotedev_report');
      if (reportId) openWindow();
    }
  }

  function handleChange() {
    if (!monitor.active) return;
    if (!errorOccurred && !monitor.isMonitorAction()) {
      relayAction();
      return;
    }
    if (monitor.isPaused() || monitor.isLocked() || monitor.isTimeTraveling()) {
      return;
    }
    const liftedState = store.liftedStore.getState();
    if (
      errorOccurred &&
      !liftedState.computedStates[liftedState.currentStateIndex].error
    ) {
      errorOccurred = false;
    }
    relayState(liftedState);
  }

  const enhance =
    (): StoreEnhancer =>
    <NextExt, NextStateExt>(
      next: StoreEnhancerStoreCreator<NextExt, NextStateExt>
    ): any => {
      return <S2 extends S, A2 extends A>(
        reducer_: Reducer<S2, A2>,
        initialState_?: PreloadedState<S2>
      ) => {
        if (!isAllowed(window.devToolsOptions)) {
          return next(reducer_, initialState_);
        }

        store = stores[instanceId] = configureStore(next, monitor.reducer, {
          ...config,
          maxAge: getMaxAge as any,
        })(reducer_, initialState_) as any;

        if (isInIframe()) setTimeout(init, 3000);
        else init();

        return store;
      };
    };

  if (!reducer) return enhance();
  /* eslint-disable no-console */
  console.warn(
    'Creating a Redux store directly from DevTools extension is discouraged and will not be supported in future major version. For more details see: https://git.io/fphCe'
  );
  /* eslint-enable no-console */
  return createStore(reducer, preloadedState, enhance);
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

// noinspection JSAnnotator
window.__REDUX_DEVTOOLS_EXTENSION__ = __REDUX_DEVTOOLS_EXTENSION__ as any;
window.__REDUX_DEVTOOLS_EXTENSION__.open = openWindow;
window.__REDUX_DEVTOOLS_EXTENSION__.updateStore = updateStore(stores);
window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors = notifyErrors;
window.__REDUX_DEVTOOLS_EXTENSION__.send = sendMessage;
window.__REDUX_DEVTOOLS_EXTENSION__.listen = setListener;
window.__REDUX_DEVTOOLS_EXTENSION__.connect = connect;
window.__REDUX_DEVTOOLS_EXTENSION__.disconnect = disconnect;

const preEnhancer =
  (instanceId: number): StoreEnhancer =>
  (next) =>
  (reducer, preloadedState) => {
    const store = next(reducer, preloadedState);

    if (stores[instanceId]) {
      (stores[instanceId].initialDispatch as any) = store.dispatch;
    }

    return {
      ...store,
      dispatch: (...args: any[]) =>
        !window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ &&
        (store.dispatch as any)(...args),
    } as any;
  };

const extensionCompose =
  (config: Config) =>
  (...funcs: StoreEnhancer[]) => {
    return (...args: any[]) => {
      const instanceId = generateId(config.instanceId);
      return [preEnhancer(instanceId), ...funcs].reduceRight(
        (composed, f) => f(composed),
        (__REDUX_DEVTOOLS_EXTENSION__({ ...config, instanceId }) as any)(
          ...args
        )
      );
    };
  };

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: unknown;
  }
}

window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = (...funcs: any[]) => {
  if (funcs.length === 0) {
    return __REDUX_DEVTOOLS_EXTENSION__();
  }
  if (funcs.length === 1 && typeof funcs[0] === 'object') {
    return extensionCompose(funcs[0]);
  }
  return extensionCompose({})(...funcs);
};
