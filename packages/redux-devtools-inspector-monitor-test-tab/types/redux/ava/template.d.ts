export declare const name = "Ava template";
export declare const dispatcher = "state = reducers(${prevState}, ${action});";
export declare const assertion = "t.deepEqual(state, ${curState});";
export declare const wrap = "import test from 'ava';\nimport reducers from '../../reducers';\n\ntest('reducers', (t) => {\n  let state;\n  ${assertions}\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
