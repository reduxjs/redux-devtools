export const name = 'Ava template';

export const dispatcher = 'state = reducers(${prevState}, ${action});';

export const assertion = 't.deepEqual(state, ${curState});';

export const wrap = (
  `import test from 'ava';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  \${assertions}
});
`);

export default { name, assertion, dispatcher, wrap };
