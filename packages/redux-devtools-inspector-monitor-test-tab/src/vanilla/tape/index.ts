import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Tape template';

export const dispatcher = ({ action }: DispatcherLocals) => `${action!};`;

export const assertion = ({ path, curState }: AssertionLocals) =>
  `t.deepEqual(state${path}, ${curState!});`;

export const wrap = ({ name, initialState, assertions }: WrapLocals) =>
  `import test from 'tape';
import ${name!} from '../../stores/${name!}';

test('${name!}', (t) => {
  const store = new ${name!}(${initialState!});
  ${assertions}
  t.end();
});
`;

export default { name, assertion, dispatcher, wrap };
