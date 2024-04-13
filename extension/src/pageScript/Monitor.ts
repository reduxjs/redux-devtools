import { Action } from 'redux';
import { LiftedState } from '@redux-devtools/instrument';
import { DispatchAction, LibConfig } from '@redux-devtools/app';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_LOCKED__?: boolean;
  }
}

export default class Monitor<S, A extends Action<string>> {
  update: (
    liftedState?: LiftedState<S, A, unknown> | undefined,
    libConfig?: LibConfig,
  ) => void;
  active?: boolean;
  paused?: boolean;
  lastAction?: string;
  waitingTimeout?: number;

  constructor(
    update: (
      liftedState?: LiftedState<S, A, unknown> | undefined,
      libConfig?: LibConfig,
    ) => void,
  ) {
    this.update = update;
  }
  reducer = (state = {}, action: DispatchAction) => {
    if (!this.active) return state;
    this.lastAction = action.type;
    if (action.type === 'LOCK_CHANGES') {
      window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ = action.status;
    } else if (action.type === 'PAUSE_RECORDING') {
      this.paused = action.status;
    } else if (this.isHotReloaded()) {
      // Send new lifted state on hot-reloading
      setTimeout(this.update, 0);
    }
    return state;
  };
  start = (skipUpdate: boolean) => {
    this.active = true;
    if (!skipUpdate) this.update();
  };
  stop = () => {
    this.active = false;
    clearTimeout(this.waitingTimeout);
  };
  isHotReloaded = () =>
    this.lastAction && /^@@redux\/(INIT|REPLACE)/.test(this.lastAction);
  isMonitorAction = () =>
    this.lastAction && this.lastAction !== 'PERFORM_ACTION';
  isTimeTraveling = () =>
    this.lastAction === 'JUMP_TO_STATE' || this.lastAction === 'JUMP_TO_ACTION';
  isPaused = () => {
    if (this.paused) {
      if (this.lastAction !== 'BLOCKED') {
        if (!window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__) {
          this.lastAction = 'BLOCKED';
        }
        return false;
      }
      return true;
    }
    return false;
  };
  isLocked = () => {
    if (window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__) {
      if (this.lastAction !== 'BLOCKED') {
        this.lastAction = 'BLOCKED';
        return false;
      }
      return true;
    }
    return false;
  };
}
