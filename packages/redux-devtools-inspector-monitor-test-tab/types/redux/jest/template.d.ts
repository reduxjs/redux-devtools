export declare const name = "Jest template";
export declare const dispatcher = "state = reducers(${prevState}, ${action});";
export declare const assertion = "expect(state).toEqual(${curState});";
export declare const wrap = "import reducers from '../../reducers';\n\ntest('reducers', () => {\n  let state;\n  ${assertions}\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
