import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Tape template';

export const dispatcher = ({ action, prevState }: DispatcherLocals) =>
  `state = reducers(${prevState!}, ${action!});`;

export const assertion = ({ curState }: AssertionLocals) =>
  `t.deepEqual(state, ${curState!});`;

export const wrap = ({ assertions }: WrapLocals) =>
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  ${assertions}
  t.end();
});
`;

export default { name, assertion, dispatcher, wrap };
