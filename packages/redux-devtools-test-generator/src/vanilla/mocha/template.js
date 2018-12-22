export const name = 'Mocha template';

export const dispatcher = '${action};';

export const assertion = 'expect(store${path}).toEqual(${curState});';

export const wrap = (
  `import expect from 'expect';
import \${name} from '../../stores/\${name}';

describe('\${name}', () => {
  it('\${actionName}', () => {
    const store = new \${name}(\${initialState});
    \${assertions}
  });
});
`);

export default { name, assertion, dispatcher, wrap };
