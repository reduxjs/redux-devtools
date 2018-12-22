import { assertion } from '../src/vanilla/mocha';
import { compare } from '../src/TestGenerator';

const computedStates = [
  { state: { o1: 0 } },
  { state: { o1: 0, o2: 1 } },
  { state: { o1: 0, o2: 'a' } },
  { state: { o1: [{ t: 1 }], o3: { t: 2 } } },
  { state: { o1: [{ t: 3 }], o3: { t: 2 } } },
  { state: [0, 1, 2, 3, 4] },
  { state: [0, 3] },
  { state: [0, 2, 3, 4] }
];

const test = (s1, s2) => compare(s1, s2,
  ({ path, curState }) => (
    expect(`expect(store${path}).toEqual(${curState});`)
      .toBe(assertion({ path, curState }))
  )
);

describe('Assertions', () => {
  it('should return initial state', () => {
    test(
      undefined,
      computedStates[0]
    );
  });

  it('should add element', () => {
    test(
      computedStates[0],
      computedStates[1]
    );
  });

  it('should remove element', () => {
    test(
      computedStates[1],
      computedStates[0]
    );
  });

  it('should change element', () => {
    test(
      computedStates[1],
      computedStates[2]
    );
  });

  it('should add, change and remove elements', () => {
    test(
      computedStates[2],
      computedStates[3]
    );
  });

  it('should change in array', () => {
    test(
      computedStates[3],
      computedStates[4]
    );
  });

  it('should remove elements in array', () => {
    test(
      computedStates[5],
      computedStates[6]
    );
  });

  it('should add elements in array', () => {
    test(
      computedStates[6],
      computedStates[5]
    );
  });

  it('should add and change elements in array', () => {
    test(
      computedStates[5],
      computedStates[7]
    );
  });
});
