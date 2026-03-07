import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types.js';
export declare const name = "Mocha template";
export declare const dispatcher: ({ action, prevState }: DispatcherLocals) => string;
export declare const assertion: ({ curState }: AssertionLocals) => string;
export declare const wrap: ({ assertions }: WrapLocals) => string;
declare const _default: {
    name: string;
    assertion: ({ curState }: AssertionLocals) => string;
    dispatcher: ({ action, prevState }: DispatcherLocals) => string;
    wrap: ({ assertions }: WrapLocals) => string;
};
export default _default;
