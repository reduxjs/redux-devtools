export declare const name = "Tape template";
export declare const dispatcher = "state = reducers(${prevState}, ${action});";
export declare const assertion = "t.deepEqual(state, ${curState});";
export declare const wrap = "import test from 'tape';\nimport reducers from '../../reducers';\n\ntest('reducers', (t) => {\n  let state;\n  ${assertions}\n  t.end();\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
