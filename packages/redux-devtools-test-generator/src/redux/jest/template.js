export const name = 'Jest template';

export const dispatcher = 'state = reducers(${prevState}, ${action});';

export const assertion = 'expect(state).toEqual(${curState});';

export const wrap = (
  `import reducers from '../../reducers';

test('reducers', () => {
  let state;
  \${assertions}
});
`);

export default { name, assertion, dispatcher, wrap };
