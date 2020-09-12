import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Mocha template';

export const dispatcher = ({ action, prevState }: DispatcherLocals) =>
  `state = reducers(${prevState!}, ${action!});`;

export const assertion = ({ curState }: AssertionLocals) =>
  `expect(state).toEqual(${curState!});`;

export const wrap = ({ assertions }: WrapLocals) =>
  `import expect from 'expect';
import reducers from '../../reducers';

describe('reducers', () => {
  it('should handle actions', () => {
    let state;
    ${assertions}
  });
});
`;

export default { name, assertion, dispatcher, wrap };
