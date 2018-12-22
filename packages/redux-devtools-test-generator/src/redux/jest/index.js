export const name = 'Jest template';

export const dispatcher = ({ action, prevState }) => (
  `state = reducers(${prevState}, ${action});`
);

export const assertion = ({ curState }) => (
  `expect(state).toEqual(${curState});`
);

export const wrap = ({ assertions }) => (
  `import reducers from '../../reducers';

test('reducers', () => {
  let state;
  ${assertions}
});
`);

export default { name, assertion, dispatcher, wrap };
