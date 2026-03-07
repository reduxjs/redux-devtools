import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types.js';
export declare const name = "Tape template";
export declare const dispatcher: ({ action }: DispatcherLocals) => string;
export declare const assertion: ({ path, curState }: AssertionLocals) => string;
export declare const wrap: ({ name, initialState, assertions }: WrapLocals) => string;
declare const _default: {
    name: string;
    assertion: ({ path, curState }: AssertionLocals) => string;
    dispatcher: ({ action }: DispatcherLocals) => string;
    wrap: ({ name, initialState, assertions }: WrapLocals) => string;
};
export default _default;
