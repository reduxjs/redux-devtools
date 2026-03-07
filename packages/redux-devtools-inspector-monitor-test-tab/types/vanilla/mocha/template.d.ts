export declare const name = "Mocha template";
export declare const dispatcher = "${action};";
export declare const assertion = "expect(store${path}).toEqual(${curState});";
export declare const wrap = "import expect from 'expect';\nimport ${name} from '../../stores/${name}';\n\ndescribe('${name}', () => {\n  it('${actionName}', () => {\n    const store = new ${name}(${initialState});\n    ${assertions}\n  });\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
