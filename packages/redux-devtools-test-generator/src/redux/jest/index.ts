import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Jest template';

export const dispatcher = ({ action, prevState }: DispatcherLocals) =>
  `state = reducers(${prevState!}, ${action!});`;

export const assertion = ({ curState }: AssertionLocals) =>
  `expect(state).toEqual(${curState!});`;

export const wrap = ({ assertions }: WrapLocals) =>
  `import reducers from '../../reducers';

test('reducers', () => {
  let state;
  ${assertions}
});
`;

export default { name, assertion, dispatcher, wrap };
