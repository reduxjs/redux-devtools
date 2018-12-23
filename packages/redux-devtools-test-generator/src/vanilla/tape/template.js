export const name = 'Tape template';

export const dispatcher = '${action};';

export const assertion = 't.deepEqual(state${path}, ${curState});';

export const wrap = (
  `import test from 'tape';
import \${name} from '../../stores/\${name}';

test('\${name}', (t) => {
  const store = new \${name}(\${initialState});
  \${assertions}
  t.end();
});
`);

export default { name, assertion, dispatcher, wrap };
