export declare const name = "Mocha template";
export declare const dispatcher = "state = reducers(${prevState}, ${action});";
export declare const assertion = "expect(state).toEqual(${curState});";
export declare const wrap = "import expect from 'expect';\nimport reducers from '../../reducers';\n\ndescribe('reducers', () => {\n  it('should handle actions', () => {\n    let state;\n    ${assertions}\n  });\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
