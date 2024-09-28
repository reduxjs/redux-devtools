import {
  ActionCreatorObject,
  evalAction,
  getActionsArray,
  getLocalFilter,
} from '@redux-devtools/utils';
import { throttle } from 'lodash-es';
import { Action, ActionCreator, Dispatch, Reducer, StoreEnhancer } from 'redux';
import Immutable from 'immutable';
import {
  EnhancedStore,
  LiftedAction,
  LiftedState,
  PerformAction,
} from '@redux-devtools/instrument';
import {
  CustomAction,
  DispatchAction,
  LibConfig,
  Features,
} from '@redux-devtools/app';
import configureStore, { getUrlParam } from './enhancerStore';
import { isAllowed, Options } from '../options/syncOptions';
import Monitor from './Monitor';
import {
  noFiltersApplied,
  isFiltered,
  filterState,
  startingFrom,
} from './api/filters';
import notifyErrors from './api/notifyErrors';
import importState from './api/importState';
import openWindow, { Position } from './api/openWindow';
import generateId from './api/generateInstanceId';
import {
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
} from './api';
import type { ContentScriptToPageScriptMessage } from '../contentScript';

type EnhancedStoreWithInitialDispatch<
  S,
  A extends Action<string>,
  MonitorState,
> = EnhancedStore<S, A, MonitorState> & { initialDispatch: Dispatch<A> };

const source = '@devtools-page';
const stores: {
  [K in string | number]: EnhancedStoreWithInitialDispatch<
    unknown,
    Action<string>,
    unknown
  >;
} = {};
let reportId: string | null | undefined;

function deprecateParam(oldParam: string, newParam: string) {
  /* eslint-disable no-console */
  console.warn(
    `${oldParam} parameter is deprecated, use ${newParam} instead: https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md`,
  );
  /* eslint-enable no-console */
}

export interface SerializeWithImmutable extends Serialize {
  readonly immutable?: typeof Immutable;
  readonly refs?: (new (data: any) => unknown)[] | null;
}

export interface ConfigWithExpandedMaxAge {
  instanceId?: number;
  /**
   * @deprecated Use actionsDenylist instead.
   */
  readonly actionsBlacklist?: string | readonly string[];
  /**
   * @deprecated Use actionsAllowlist instead.
   */
  readonly actionsWhitelist?: string | readonly string[];
  readonly actionsDenylist?: string | readonly string[];
  readonly actionsAllowlist?: string | readonly string[];
  serialize?: boolean | SerializeWithImmutable;
  readonly stateSanitizer?: <S>(state: S, index?: number) => S;
  readonly actionSanitizer?: <A extends Action<string>>(
    action: A,
    id?: number,
  ) => A;
  readonly predicate?: <S, A extends Action<string>>(
    state: S,
    action: A,
  ) => boolean;
  readonly latency?: number;
  readonly maxAge?:
    | number
    | (<S, A extends Action<string>>(
        currentLiftedAction: LiftedAction<S, A, unknown>,
        previousLiftedState: LiftedState<S, A, unknown> | undefined,
      ) => number);
  readonly trace?: boolean | (() => string | undefined);
  readonly traceLimit?: number;
  readonly shouldCatchErrors?: boolean;
  readonly shouldHotReload?: boolean;
  readonly shouldRecordChanges?: boolean;
  readonly shouldStartLocked?: boolean;
  readonly pauseActionType?: unknown;
  name?: string;
  readonly autoPause?: boolean;
  readonly features?: Features;
  readonly type?: string;
  readonly getActionType?: <A extends Action<string>>(action: A) => A;
  readonly actionCreators?: {
    readonly [key: string]: ActionCreator<Action<string>>;
  };
}

export interface Config extends ConfigWithExpandedMaxAge {
  readonly maxAge?: number;
}

interface ReduxDevtoolsExtension {
  (config?: Config): StoreEnhancer;
  open: (position?: Position) => void;
  notifyErrors: (onError?: () => boolean) => void;
  send: <S, A extends Action<string>>(
    action: StructuralPerformAction<A> | StructuralPerformAction<A>[],
    state: LiftedState<S, A, unknown>,
    config: Config,
    instanceId?: number,
    name?: string,
  ) => void;
  listen: (
    onMessage: (message: ContentScriptToPageScriptMessage) => void,
    instanceId: number,
  ) => void;
  connect: (preConfig: Config) => ConnectResponse;
  disconnect: () => void;
}

declare global {
  interface Window {
    devToolsOptions: Options;
  }
}

function __REDUX_DEVTOOLS_EXTENSION__<S, A extends Action<string>>(
  config?: Config,
): StoreEnhancer {
  /* eslint-disable no-param-reassign */
  if (typeof config !== 'object') config = {};
  /* eslint-enable no-param-reassign */
  if (!window.devToolsOptions) window.devToolsOptions = {} as any;

  let store: EnhancedStoreWithInitialDispatch<S, A, unknown>;
  let errorOccurred = false;
  let maxAge: number | undefined;
  let actionCreators: readonly ActionCreatorObject[];
  let sendingActionId = 1;
  const instanceId = generateId(config.instanceId);
  const localFilter = getLocalFilter(config);
  const serializeState = getSerializeParameter(config);
  const serializeAction = getSerializeParameter(config);
  const { stateSanitizer, actionSanitizer, predicate, latency = 500 } = config;

  // Deprecate actionsWhitelist and actionsBlacklist
  if (config.actionsWhitelist) {
    deprecateParam('actionsWhiteList', 'actionsAllowlist');
  }
  if (config.actionsBlacklist) {
    deprecateParam('actionsBlacklist', 'actionsDenylist');
  }

  const relayState = throttle(
    (
      liftedState?: LiftedState<S, A, unknown> | undefined,
      libConfig?: LibConfig,
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
            predicate,
          ),
          source,
          instanceId,
          libConfig,
        },
        serializeState,
        serializeAction,
      );
    },
    latency,
  );

  const monitor = new Monitor(relayState);

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
      serializeAction,
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
                nextActionId - 1,
              ),
          maxAge: getMaxAge(),
          nextActionId,
        },
        serializeState,
        serializeAction,
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
      predicate,
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
            predicate,
          ),
          source,
          instanceId,
        },
        serializeState,
        serializeAction,
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
      serializeAction,
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
          payload: (e as Error).message,
          source,
          instanceId,
        },
        serializeState,
        serializeAction,
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
          payload: (e as Error).message,
          source,
          instanceId,
        },
        serializeState,
        serializeAction,
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
            serializeAction,
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
            serializeAction,
          );
        }
        return;
      case 'OPTIONS':
        window.devToolsOptions = Object.assign(
          window.devToolsOptions || {},
          message.options,
        );
        return;
    }
  }

  const filteredActionIds: number[] = []; // simple circular buffer of non-excluded actions with fixed maxAge-1 length
  const getMaxAge = (
    liftedAction?: LiftedAction<S, A, unknown>,
    liftedState?: LiftedState<S, A, unknown> | undefined,
  ) => {
    const m = (config && config.maxAge) || window.devToolsOptions.maxAge || 50;
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
        while (maxAge > m && !filteredActionIds.includes(stagedActionIds[i])) {
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
      serializeAction,
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

  const enhance = (): StoreEnhancer => (next) => {
    return <S2, A2 extends Action<string>, PreloadedState>(
      reducer_: Reducer<S2, A2, PreloadedState>,
      initialState_?: PreloadedState | undefined,
    ) => {
      if (!isAllowed(window.devToolsOptions)) {
        return next(reducer_, initialState_);
      }

      store = stores[instanceId] = (
        configureStore(next, monitor.reducer, {
          ...config,
          maxAge: getMaxAge as any,
        }) as any
      )(reducer_, initialState_);

      if (isInIframe()) setTimeout(init, 3000);
      else init();

      return store as any;
    };
  };

  return enhance();
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

// noinspection JSAnnotator
window.__REDUX_DEVTOOLS_EXTENSION__ = __REDUX_DEVTOOLS_EXTENSION__ as any;
window.__REDUX_DEVTOOLS_EXTENSION__.open = openWindow;
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

export type InferComposedStoreExt<StoreEnhancers> = StoreEnhancers extends [
  infer HeadStoreEnhancer,
  ...infer RestStoreEnhancers,
]
  ? HeadStoreEnhancer extends StoreEnhancer<infer StoreExt>
    ? StoreExt & InferComposedStoreExt<RestStoreEnhancers>
    : never
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

const extensionCompose =
  (config: Config) =>
  <StoreEnhancers extends readonly StoreEnhancer[]>(
    ...funcs: StoreEnhancers
  ): StoreEnhancer<InferComposedStoreExt<StoreEnhancers>> => {
    // @ts-expect-error FIXME
    return (...args) => {
      const instanceId = generateId(config.instanceId);
      return [preEnhancer(instanceId), ...funcs].reduceRight(
        (composed, f) => f(composed),
        __REDUX_DEVTOOLS_EXTENSION__({ ...config, instanceId })(...args),
      );
    };
  };

interface ReduxDevtoolsExtensionCompose {
  (
    config: Config,
  ): <StoreEnhancers extends readonly StoreEnhancer[]>(
    ...funcs: StoreEnhancers
  ) => StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
  <StoreEnhancers extends readonly StoreEnhancer[]>(
    ...funcs: StoreEnhancers
  ): StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: ReduxDevtoolsExtensionCompose;
  }
}

function reduxDevtoolsExtensionCompose(
  config: Config,
): <StoreEnhancers extends readonly StoreEnhancer[]>(
  ...funcs: StoreEnhancers
) => StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
function reduxDevtoolsExtensionCompose<
  StoreEnhancers extends readonly StoreEnhancer[],
>(
  ...funcs: StoreEnhancers
): StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
function reduxDevtoolsExtensionCompose(...funcs: [Config] | StoreEnhancer[]) {
  if (funcs.length === 0) {
    return __REDUX_DEVTOOLS_EXTENSION__();
  }
  if (funcs.length === 1 && typeof funcs[0] === 'object') {
    return extensionCompose(funcs[0]);
  }
  return extensionCompose({})(...(funcs as StoreEnhancer[]));
}

window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = reduxDevtoolsExtensionCompose;
