export const name = 'Mocha template';

export const dispatcher = ({ action }) => (
  `${action};`
);

export const assertion = ({ path, curState }) => (
  `expect(store${path}).toEqual(${curState});`
);

export const wrap = ({ name, initialState, assertions }) => (
  `import expect from 'expect';
import ${name} from '../../stores/${name}';

test('${name}', (t) => {
  const store = new ${name}(${initialState});
  ${assertions}
});
`);

export default { name, assertion, dispatcher, wrap };
