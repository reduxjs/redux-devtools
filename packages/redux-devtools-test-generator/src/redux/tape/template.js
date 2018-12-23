export const name = 'Tape template';

export const dispatcher = 'state = reducers(${prevState}, ${action});';

export const assertion = 't.deepEqual(state, ${curState});';

export const wrap = (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  \${assertions}
  t.end();
});
`);

export default { name, assertion, dispatcher, wrap };
