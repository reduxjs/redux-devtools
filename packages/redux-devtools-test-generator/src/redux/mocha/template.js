export const name = 'Mocha template';

export const dispatcher = 'state = reducers(${prevState}, ${action});';

export const assertion = 'expect(state).toEqual(${curState});';

export const wrap = (
  `import expect from 'expect';
import reducers from '../../reducers';

describe('reducers', () => {
  it('should handle actions', () => {
    let state;
    \${assertions}
  });
});
`);

export default { name, assertion, dispatcher, wrap };
