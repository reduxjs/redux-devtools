export const name = 'Ava template';

export const dispatcher = ({ action }) => (
  `${action};`
);

export const assertion = ({ path, curState }) => (
  `t.deepEqual(state${path}, ${curState});`
);

export const wrap = ({ name, initialState, assertions }) => (
  `import test from 'ava';
import ${name} from '../../stores/${name}';

test('${name}', (t) => {
  const store = new ${name}(${initialState});
  ${assertions}
});
`);

export default { name, assertion, dispatcher, wrap };
