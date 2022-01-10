import { stringify, parse } from 'jsan';
import socketCluster, { SCClientSocket } from 'socketcluster-client';
import configureStore from './configureStore';
import { defaultSocketOptions } from './constants';
import getHostForRN from 'rn-host-detect';
import {
  Action,
  ActionCreator,
  PreloadedState,
  Reducer,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from 'redux';
import {
  EnhancedStore,
  LiftedAction,
  LiftedState,
  PerformAction,
} from '@redux-devtools/instrument';
import {
  ActionCreatorObject,
  ErrorAction,
  evalAction,
  catchErrors,
  getActionsArray,
  getLocalFilter,
  isFiltered,
  filterStagedActions,
  filterState,
  LocalFilter,
  State,
} from '@redux-devtools/utils';

function async(fn: () => unknown) {
  setTimeout(fn, 0);
}

function str2array(
  str: string | readonly string[] | undefined
): readonly string[] | undefined {
  return typeof str === 'string'
    ? [str]
    : str && str.length > 0
    ? str
    : undefined;
}

function getRandomId() {
  return Math.random().toString(36).substr(2);
}

interface AutoReconnectOptions {
  readonly randomness?: number;
}

interface SocketOptions {
  readonly secure?: boolean;
  readonly hostname: string;
  readonly port: number;
  readonly autoReconnect?: boolean;
  readonly autoReconnectOptions?: AutoReconnectOptions;
}

interface Filters {
  /**
   * @deprecated Use actionsDenylist instead.
   */
  readonly blacklist?: string | readonly string[];
  /**
   * @deprecated Use actionsAllowlist instead.
   */
  readonly whitelist?: string | readonly string[];
  readonly denylist?: string | readonly string[];
  readonly allowlist?: string | readonly string[];
}

interface Options<S, A extends Action<unknown>> {
  readonly hostname?: string;
  readonly realtime?: boolean;
  readonly maxAge?: number;
  readonly trace?: boolean | ((action: A) => string | undefined);
  readonly traceLimit?: number;
  readonly shouldHotReload?: boolean;
  readonly shouldRecordChanges?: boolean;
  readonly shouldStartLocked?: boolean;
  readonly pauseActionType?: unknown;
  readonly name?: string;
  readonly filters?: Filters;
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
  readonly port?: number;
  readonly secure?: boolean;
  readonly suppressConnectErrors?: boolean;
  readonly startOn?: string | readonly string[];
  readonly stopOn?: string | readonly string[];
  readonly sendOn?: string | readonly string[];
  readonly sendOnError?: number;
  readonly sendTo?: string;
  readonly id?: string;
  readonly actionCreators?: {
    [key: string]: ActionCreator<Action<unknown>>;
  };
  readonly stateSanitizer?: ((state: S, index?: number) => S) | undefined;
  readonly actionSanitizer?:
    | (<A extends Action<unknown>>(action: A, id?: number) => A)
    | undefined;
}

interface MessageToRelay {
  type: 'STATE' | 'ACTION' | 'START' | 'STOP' | 'ERROR';
  id: string;
  name: string | undefined;
  instanceId: string;
  payload?: string;
  action?: string | ActionCreatorObject[];
  isExcess?: boolean | undefined;
  nextActionId?: number | undefined;
}

interface ImportMessage {
  readonly type: 'IMPORT';
  readonly state: string;
}

interface SyncMessage {
  readonly type: 'SYNC';
  readonly state: string;
  readonly id: string | undefined;
  readonly instanceId: string | number;
}

interface UpdateMessage {
  readonly type: 'UPDATE';
}

interface StartMessage {
  readonly type: 'START';
}

interface StopMessage {
  readonly type: 'STOP';
}

interface DisconnectedMessage {
  readonly type: 'DISCONNECTED';
}

interface ActionMessage {
  readonly type: 'ACTION';
  readonly action: string | { args: string[]; rest: string; selected: number };
}

interface DispatchMessage<S, A extends Action<unknown>> {
  readonly type: 'DISPATCH';
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly action: LiftedAction<S, A, {}>;
}

type Message<S, A extends Action<unknown>> =
  | ImportMessage
  | SyncMessage
  | UpdateMessage
  | StartMessage
  | StopMessage
  | DisconnectedMessage
  | ActionMessage
  | DispatchMessage<S, A>;

class DevToolsEnhancer<S, A extends Action<unknown>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  store!: EnhancedStore<S, A, {}>;
  filters: LocalFilter | undefined;
  instanceId?: string;
  socket?: SCClientSocket;
  sendTo?: string;
  instanceName: string | undefined;
  appInstanceId!: string;
  stateSanitizer: ((state: S, index?: number) => S) | undefined;
  actionSanitizer: ((action: A, id?: number) => A) | undefined;
  isExcess?: boolean;
  actionCreators?: (() => ActionCreatorObject[]) | ActionCreatorObject[];
  isMonitored?: boolean;
  lastErrorMsg?: string | Event;
  started?: boolean;
  socketOptions!: SocketOptions;
  suppressConnectErrors!: boolean;
  startOn: readonly string[] | undefined;
  stopOn: readonly string[] | undefined;
  sendOn: readonly string[] | undefined;
  sendOnError: number | undefined;
  channel?: string;
  errorCounts: { [errorName: string]: number } = {};
  lastAction?: unknown;
  paused?: boolean;
  locked?: boolean;

  getLiftedStateRaw() {
    return this.store.liftedStore.getState();
  }

  getLiftedState() {
    return filterStagedActions(this.getLiftedStateRaw(), this.filters);
  }

  send = () => {
    if (!this.instanceId)
      this.instanceId = (this.socket && this.socket.id) || getRandomId();
    try {
      fetch(this.sendTo!, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          type: 'STATE',
          id: this.instanceId,
          name: this.instanceName,
          payload: stringify(this.getLiftedState()),
        }),
      }).catch(function (err) {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  relay(
    type: 'STATE' | 'ACTION' | 'START' | 'STOP' | 'ERROR',
    state?: State | S | string,
    action?: PerformAction<A> | ActionCreatorObject[],
    nextActionId?: number
  ) {
    const message: MessageToRelay = {
      type,
      id: this.socket!.id,
      name: this.instanceName,
      instanceId: this.appInstanceId,
    };
    if (state) {
      message.payload =
        type === 'ERROR'
          ? (state as string)
          : stringify(
              filterState(
                state as State,
                type,
                this.filters,
                this.stateSanitizer as (
                  state: unknown,
                  index?: number
                ) => unknown,
                this.actionSanitizer as
                  | ((action: Action<unknown>, id: number) => Action)
                  | undefined,
                nextActionId!
              )
            );
    }
    if (type === 'ACTION') {
      message.action = stringify(
        !this.actionSanitizer
          ? action
          : this.actionSanitizer(
              (action as PerformAction<A>).action,
              nextActionId! - 1
            )
      );
      message.isExcess = this.isExcess;
      message.nextActionId = nextActionId;
    } else if (action) {
      message.action = action as ActionCreatorObject[];
    }
    this.socket!.emit(this.socket!.id ? 'log' : 'log-noid', message);
  }

  dispatchRemotely(
    action: string | { args: string[]; rest: string; selected: number }
  ) {
    try {
      const result = evalAction(
        action,
        this.actionCreators as ActionCreatorObject[]
      );
      this.store.dispatch(result);
    } catch (e: unknown) {
      this.relay('ERROR', (e as Error).message);
    }
  }

  handleMessages = (message: Message<S, A>) => {
    if (
      message.type === 'IMPORT' ||
      (message.type === 'SYNC' &&
        this.socket!.id &&
        message.id !== this.socket!.id)
    ) {
      this.store.liftedStore.dispatch({
        type: 'IMPORT_STATE',
        // eslint-disable-next-line @typescript-eslint/ban-types
        nextLiftedState: parse(message.state) as LiftedState<S, A, {}>,
      });
    } else if (message.type === 'UPDATE') {
      this.relay('STATE', this.getLiftedState());
    } else if (message.type === 'START') {
      this.isMonitored = true;
      if (typeof this.actionCreators === 'function')
        this.actionCreators = this.actionCreators();
      this.relay('STATE', this.getLiftedState(), this.actionCreators);
    } else if (message.type === 'STOP' || message.type === 'DISCONNECTED') {
      this.isMonitored = false;
      this.relay('STOP');
    } else if (message.type === 'ACTION') {
      this.dispatchRemotely(message.action);
    } else if (message.type === 'DISPATCH') {
      this.store.liftedStore.dispatch(message.action);
    }
  };

  sendError = (errorAction: ErrorAction) => {
    // Prevent flooding
    if (errorAction.message && errorAction.message === this.lastErrorMsg)
      return;
    this.lastErrorMsg = errorAction.message;

    async(() => {
      this.store.dispatch(errorAction as A);
      if (!this.started) this.send();
    });
  };

  init(options: Options<S, A>) {
    this.instanceName = options.name;
    this.appInstanceId = getRandomId();
    const { blacklist, whitelist, denylist, allowlist } = options.filters || {};
    this.filters = getLocalFilter({
      actionsDenylist:
        denylist ??
        options.actionsDenylist ??
        blacklist ??
        options.actionsBlacklist,
      actionsAllowlist:
        allowlist ??
        options.actionsAllowlist ??
        whitelist ??
        options.actionsWhitelist,
    });
    if (options.port) {
      this.socketOptions = {
        port: options.port,
        hostname: options.hostname || 'localhost',
        secure: options.secure,
      };
    } else this.socketOptions = defaultSocketOptions;

    this.suppressConnectErrors =
      options.suppressConnectErrors !== undefined
        ? options.suppressConnectErrors
        : true;

    this.startOn = str2array(options.startOn);
    this.stopOn = str2array(options.stopOn);
    this.sendOn = str2array(options.sendOn);
    this.sendOnError = options.sendOnError;
    if (this.sendOn || this.sendOnError) {
      this.sendTo =
        options.sendTo ||
        `${this.socketOptions.secure ? 'https' : 'http'}://${
          this.socketOptions.hostname
        }:${this.socketOptions.port}`;
      this.instanceId = options.id;
    }
    if (this.sendOnError === 1) catchErrors(this.sendError);

    if (options.actionCreators)
      this.actionCreators = () => getActionsArray(options.actionCreators!);
    this.stateSanitizer = options.stateSanitizer;
    this.actionSanitizer = options.actionSanitizer;
  }

  login() {
    this.socket!.emit('login', 'master', (err: Error, channelName: string) => {
      if (err) {
        console.log(err);
        return;
      }
      this.channel = channelName;
      this.socket!.subscribe(channelName).watch(this.handleMessages);
      this.socket!.on(channelName, this.handleMessages);
    });
    this.started = true;
    this.relay('START');
  }

  stop = (keepConnected?: boolean) => {
    this.started = false;
    this.isMonitored = false;
    if (!this.socket) return;
    this.socket.destroyChannel(this.channel!);
    if (keepConnected) {
      this.socket.off(this.channel, this.handleMessages);
    } else {
      this.socket.off();
      this.socket.disconnect();
    }
  };

  start = () => {
    if (
      this.started ||
      (this.socket && this.socket.getState() === this.socket.CONNECTING)
    )
      return;

    this.socket = socketCluster.create(this.socketOptions);

    this.socket.on('error', (err) => {
      // if we've already had this error before, increment it's counter, otherwise assign it '1' since we've had the error once.
      // eslint-disable-next-line no-prototype-builtins
      this.errorCounts[err.name] = this.errorCounts.hasOwnProperty(err.name)
        ? this.errorCounts[err.name] + 1
        : 1;

      if (this.suppressConnectErrors) {
        if (this.errorCounts[err.name] === 1) {
          console.log(
            'remote-redux-devtools: Socket connection errors are being suppressed. ' +
              '\n' +
              "This can be disabled by setting suppressConnectErrors to 'false'."
          );
          console.log(err);
        }
      } else {
        console.log(err);
      }
    });
    this.socket.on('connect', () => {
      console.log('connected to remotedev-server');
      this.errorCounts = {}; // clear the errorCounts object, so that we'll log any new errors in the event of a disconnect
      this.login();
    });
    this.socket.on('disconnect', () => {
      this.stop(true);
    });
  };

  checkForReducerErrors = (liftedState = this.getLiftedStateRaw()) => {
    if (liftedState.computedStates[liftedState.currentStateIndex].error) {
      if (this.started)
        this.relay('STATE', filterStagedActions(liftedState, this.filters));
      else this.send();
      return true;
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  monitorReducer = (state = {}, action: LiftedAction<S, A, {}>) => {
    this.lastAction = action.type;
    if (!this.started && this.sendOnError === 2 && this.store.liftedStore)
      async(this.checkForReducerErrors);
    else if ((action as PerformAction<A>).action) {
      if (
        this.startOn &&
        !this.started &&
        this.startOn.indexOf(
          (action as PerformAction<A>).action.type as string
        ) !== -1
      )
        async(this.start);
      else if (
        this.stopOn &&
        this.started &&
        this.stopOn.indexOf(
          (action as PerformAction<A>).action.type as string
        ) !== -1
      )
        async(this.stop);
      else if (
        this.sendOn &&
        !this.started &&
        this.sendOn.indexOf(
          (action as PerformAction<A>).action.type as string
        ) !== -1
      )
        async(this.send);
    }
    return state;
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  handleChange(state: S, liftedState: LiftedState<S, A, {}>, maxAge: number) {
    if (this.checkForReducerErrors(liftedState)) return;

    if (this.lastAction === 'PERFORM_ACTION') {
      const nextActionId = liftedState.nextActionId;
      const liftedAction = liftedState.actionsById[nextActionId - 1];
      if (isFiltered(liftedAction.action, this.filters)) return;
      this.relay('ACTION', state, liftedAction, nextActionId);
      if (!this.isExcess && maxAge)
        this.isExcess = liftedState.stagedActionIds.length >= maxAge;
    } else {
      if (this.lastAction === 'JUMP_TO_STATE') return;
      if (this.lastAction === 'PAUSE_RECORDING') {
        this.paused = liftedState.isPaused;
      } else if (this.lastAction === 'LOCK_CHANGES') {
        this.locked = liftedState.isLocked;
      }
      if (this.paused || this.locked) {
        if (this.lastAction) this.lastAction = undefined;
        else return;
      }
      this.relay('STATE', filterStagedActions(liftedState, this.filters));
    }
  }

  enhance = (options: Options<S, A> = {}): StoreEnhancer => {
    this.init({
      ...options,
      hostname: getHostForRN(options.hostname || 'localhost'),
    });
    const realtime =
      typeof options.realtime === 'undefined'
        ? process.env.NODE_ENV === 'development'
        : options.realtime;
    if (!realtime && !(this.startOn || this.sendOn || this.sendOnError))
      return (f: StoreEnhancerStoreCreator) => f;

    const maxAge = options.maxAge || 30;
    return ((next: StoreEnhancerStoreCreator) => {
      return (reducer: Reducer<S, A>, initialState: PreloadedState<S>) => {
        this.store = configureStore(next, this.monitorReducer, {
          maxAge,
          trace: options.trace,
          traceLimit: options.traceLimit,
          shouldCatchErrors: !!this.sendOnError,
          shouldHotReload: options.shouldHotReload,
          shouldRecordChanges: options.shouldRecordChanges,
          shouldStartLocked: options.shouldStartLocked,
          pauseActionType: options.pauseActionType || '@@PAUSED',
        })(reducer, initialState);

        if (realtime) this.start();
        this.store.subscribe(() => {
          if (this.isMonitored)
            this.handleChange(
              this.store.getState(),
              this.getLiftedStateRaw(),
              maxAge
            );
        });
        return this.store;
      };
    }) as any;
  };
}

export default <S, A extends Action<unknown>>(options?: Options<S, A>) =>
  new DevToolsEnhancer<S, A>().enhance(options);

const compose =
  (options: Options<unknown, Action<unknown>>) =>
  (...funcs: StoreEnhancer[]) =>
  (...args: unknown[]) => {
    const devToolsEnhancer = new DevToolsEnhancer();

    function preEnhancer(createStore: StoreEnhancerStoreCreator) {
      return <S, A extends Action<unknown>>(
        reducer: Reducer<S, A>,
        preloadedState: PreloadedState<S>
      ) => {
        devToolsEnhancer.store = createStore(reducer, preloadedState) as any;
        return {
          ...devToolsEnhancer.store,
          dispatch: (action: Action<unknown>) =>
            devToolsEnhancer.locked
              ? action
              : devToolsEnhancer.store.dispatch(action),
        };
      };
    }

    return [preEnhancer, ...funcs].reduceRight(
      (composed, f) => f(composed) as any,
      devToolsEnhancer.enhance(options)(
        ...(args as [StoreEnhancerStoreCreator])
      )
    );
  };

export function composeWithDevTools(
  ...funcs: [Options<unknown, Action<unknown>>] | StoreEnhancer[]
) {
  if (funcs.length === 0) {
    return new DevToolsEnhancer().enhance();
  }
  if (funcs.length === 1 && typeof funcs[0] === 'object') {
    return compose(funcs[0]);
  }
  return compose({})(...(funcs as StoreEnhancer[]));
}
