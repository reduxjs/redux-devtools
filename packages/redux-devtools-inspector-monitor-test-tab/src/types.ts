export interface DispatcherLocals {
  action: string | undefined;
  prevState: string | undefined;
}

export interface AssertionLocals {
  path: string;
  curState: number | string | undefined;
}

export interface WrapLocals {
  name: string | undefined;
  assertions: string;
  actionName?: string;
  initialState?: string | undefined;
}

export interface Template {
  name?: string;
  dispatcher: string;
  assertion: string;
  wrap: string;
}
