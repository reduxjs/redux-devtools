export declare const name = "Ava template";
export declare const dispatcher = "${action};";
export declare const assertion = "t.deepEqual(state${path}, ${curState});";
export declare const wrap = "import test from 'ava';\nimport ${name} from '../../stores/${name}';\n\ntest('${name}', (t) => {\n  const store = new ${name}(${initialState});\n  ${assertions}\n});\n";
declare const _default: {
    name: string;
    assertion: string;
    dispatcher: string;
    wrap: string;
};
export default _default;
