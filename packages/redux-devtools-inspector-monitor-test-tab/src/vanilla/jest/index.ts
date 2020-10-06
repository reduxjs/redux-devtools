import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Mocha template';

export const dispatcher = ({ action }: DispatcherLocals) => `${action!};`;

export const assertion = ({ path, curState }: AssertionLocals) =>
  `expect(store${path}).toEqual(${curState!});`;

export const wrap = ({ name, initialState, assertions }: WrapLocals) =>
  `import expect from 'expect';
import ${name!} from '../../stores/${name!}';

test('${name!}', (t) => {
  const store = new ${name!}(${initialState!});
  ${assertions}
});
`;

export default { name, assertion, dispatcher, wrap };
