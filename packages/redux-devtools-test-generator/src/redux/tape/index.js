export const name = 'Tape template';

export const dispatcher = ({ action, prevState }) => (
  `state = reducers(${prevState}, ${action});`
);

export const assertion = ({ curState }) => (
  `t.deepEqual(state, ${curState});`
);

export const wrap = ({ assertions }) => (
  `import test from 'tape';
import reducers from '../../reducers';

test('reducers', (t) => {
  let state;
  ${assertions}
  t.end();
});
`);

export default { name, assertion, dispatcher, wrap };
